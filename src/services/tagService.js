import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all tags
export const getAllTags = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [tags, total] = await Promise.all([
    prisma.tag.findMany({
      skip,
      take: limit,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    }),
    prisma.tag.count(),
  ]);

  return {
    tags,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get tag by ID
export const getTagById = async (id) => {
  const tag = await prisma.tag.findUnique({
    where: { id: parseInt(id) },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  if (!tag) return null;

  return {
    id: tag.id,
    name: tag.name,
    postCount: tag._count.posts,
  };
};

// Create a new tag
export const createTag = async (name) => {
  const tag = await prisma.tag.create({
    data: { name },
  });

  return {
    id: tag.id,
    name: tag.name,
    postCount: 0,
  };
};

// Update a tag
export const updateTag = async (id, name) => {
  const tag = await prisma.tag.update({
    where: { id: parseInt(id) },
    data: { name },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return {
    id: tag.id,
    name: tag.name,
    postCount: tag._count.posts,
  };
};

// Delete a tag
export const deleteTag = async (id) => {
  // First check if tag is used in any posts
  const tagWithPosts = await prisma.tag.findUnique({
    where: { id: parseInt(id) },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  if (tagWithPosts._count.posts > 0) {
    throw new Error("Cannot delete tag that is used in posts");
  }

  await prisma.tag.delete({
    where: { id: parseInt(id) },
  });
};

// Get posts by tag ID
export const getPostsByTagId = async (id, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const tagId = parseInt(id);

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      where: {
        published: true,
        tags: {
          some: {
            tagId,
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
            tagId,
          },
        },
      },
    }),
  ]);

  // Transform posts to include tags as an array of strings
  const formattedPosts = posts.map((post) => ({
    ...post,
    tags: post.tags.map((postTag) => postTag.tag.name),
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
