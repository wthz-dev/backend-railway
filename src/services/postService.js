import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all posts admin
export const getAllPostsAdmin = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.post.count(),
  ]);

  // Transform posts to include tags as an array of strings
  const formattedPosts = posts.map((post) => ({
    ...post,
    tags: post.tags.map((postTag) => ({
      id: postTag.tag.id,
      name: postTag.tag.name,
    })),
  }));

  return {
    posts: formattedPosts,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get all posts with pagination
export const getAllPosts = async (page = 1, limit = 10, published = true) => {
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      where: {
        published: published,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.post.count({
      where: {
        published: published,
      },
    }),
  ]);

  // Transform posts to include tags as an array of strings
  const formattedPosts = posts.map((post) => ({
    ...post,
    tags: post.tags.map((postTag) => ({
      id: postTag.tag.id,
      name: postTag.tag.name,
    })),
  }));

  return {
    posts: formattedPosts,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get post by slug
export const getPostBySlug = async (slug) => {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!post) return null;

  // Transform post to include tags as an array of strings
  return {
    ...post,
    tags: post.tags.map((postTag) => ({
      id: postTag.tag.id,
      name: postTag.tag.name,
    })),
  };
};

// Create a new post
export const createPost = async (data, authorId) => {
  const { title, slug, content, image, tags = [], published = false } = data;
  // Create or connect tags
  const tagConnections = await Promise.all(
    tags.map(async (tagId) => {
      // ตรวจสอบว่าเป็น ID หรือไม่
      const tagIdStr = String(tagId).trim();
      if (!tagIdStr) return null; // ข้าม tag ที่เป็นค่าว่าง
      
      // ตรวจสอบว่า tag ID มีอยู่จริงหรือไม่
      try {
        const existingTag = await prisma.tag.findUnique({
          where: { id: parseInt(tagIdStr) }
        });
        
        if (existingTag) {
          // ถ้ามี tag ID อยู่แล้ว ให้ใช้ ID นั้น
          return { tagId: parseInt(tagIdStr) };
        } else {
          // ถ้าไม่มี tag ID นี้ ให้ข้ามไป
          console.log(`Tag ID ${tagIdStr} not found, skipping`);
          return null;
        }
      } catch (error) {
        console.error(`Error checking tag ID ${tagIdStr}:`, error);
        return null;
      }
    })
  ).then(connections => connections.filter(Boolean)); // กรองค่า null ออก

  // Create post with tags
  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: content.substring(0, 150) + '...', // สร้าง excerpt อัตโนมัติจาก content
      content,
      image,
      published,
      author: {
        connect: { id: authorId },
      },
      tags: {
        create: tagConnections,
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  // Transform post to include tags as an array of strings
  return {
    ...post,
    tags: post.tags.map((postTag) => postTag.tag.id),
  };
};

// Update post
export const updatePost = async (slug, data) => {
  const { title, newSlug, excerpt, content, image, tags, published } = data;

  // Get existing post
  const existingPost = await prisma.post.findUnique({
    where: { slug },
    include: {
      tags: true,
    },
  });

  if (!existingPost) return null;

  // Update data object
  const updateData = {};
  if (title) updateData.title = title;
  if (newSlug) updateData.slug = newSlug;
  if (excerpt) updateData.excerpt = excerpt;
  if (content) updateData.content = content;
  if (image !== undefined) updateData.image = image;
  if (published !== undefined) updateData.published = published;

  // Handle tag updates if provided
  let tagOperations = {};
  if (tags) {
    // Delete all existing tag connections
    await prisma.postTag.deleteMany({
      where: { postId: existingPost.id },
    });

    // Create new tag connections
    const tagConnections = await Promise.all(
      tags.map(async (tagId) => {
        // ตรวจสอบว่าเป็น ID หรือไม่
        const tagIdStr = String(tagId).trim();
        if (!tagIdStr) return null; // ข้าม tag ที่เป็นค่าว่าง
        
        // ตรวจสอบว่า tag ID มีอยู่จริงหรือไม่
        try {
          const existingTag = await prisma.tag.findUnique({
            where: { id: parseInt(tagIdStr) }
          });
          
          if (existingTag) {
            // ถ้ามี tag ID อยู่แล้ว ให้ใช้ ID นั้น
            return { tagId: parseInt(tagIdStr) };
          } else {
            // ถ้าไม่มี tag ID นี้ ให้ข้ามไป
            console.log(`Tag ID ${tagIdStr} not found, skipping`);
            return null;
          }
        } catch (error) {
          console.error(`Error checking tag ID ${tagIdStr}:`, error);
          return null;
        }
      })
    ).then(connections => connections.filter(Boolean)); // กรองค่า null ออก

    tagOperations = {
      create: tagConnections,
    };
  }

  // Update the post
  const post = await prisma.post.update({
    where: { slug },
    data: {
      ...updateData,
      tags: tagOperations,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  // Transform post to include tags as an array of strings
  return {
    ...post,
    tags: post.tags.map((postTag) => postTag.tag.name),
  };
};

// Delete post
export const deletePost = async (slug) => {
  // First check if post exists
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) return null;

  // Delete post (PostTag entries will be automatically deleted due to onDelete: Cascade)
  await prisma.post.delete({
    where: { slug },
  });

  return true;
};

// Get posts by tag
export const getPostsByTag = async (tagName, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const tag = await prisma.tag.findUnique({
    where: { name: tagName },
  });

  if (!tag) {
    return {
      posts: [],
      pagination: {
        total: 0,
        page,
        limit,
        pages: 0,
      },
    };
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      where: {
        published: true,
        tags: {
          some: {
            tagId: tag.id,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.post.count({
      where: {
        published: true,
        tags: {
          some: {
            tagId: tag.id,
          },
        },
      },
    }),
  ]);

  // Transform posts to include tags as an array of strings
  const formattedPosts = posts.map((post) => ({
    ...post,
    tags: post.tags.map((postTag) => postTag.tag.id),
  }));

  return {
    posts: formattedPosts,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get all tags
export const getAllTags = async () => {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    postCount: tag._count.posts,
  }));
};
