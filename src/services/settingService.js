import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get site settings
export const getSiteSettings = async () => {
  // Try to get existing settings (id=1)
  let settings = await prisma.siteSetting.findUnique({
    where: { id: 1 },
  });

  // If no settings exist, create default settings
  if (!settings) {
    settings = await prisma.siteSetting.create({
      data: {
        siteName: "Cyberpunk Blog",
        siteDescription: "A modern blog for cyberpunk enthusiasts",
        postsPerPage: 10,
        darkMode: false,
        showTags: true,
        showCategories: true,
        enableComments: true,
        enableBanner: false,
        copyrightText: `© ${new Date().getFullYear()} Cyberpunk Blog`,
      },
    });
  }

  return settings;
};

// Update site settings
export const updateSiteSettings = async (data) => {
  // Check if settings exist
  const existingSettings = await prisma.siteSetting.findUnique({
    where: { id: 1 },
  });

  if (existingSettings) {
    // Update existing settings
    return prisma.siteSetting.update({
      where: { id: 1 },
      data,
    });
  } else {
    // Create new settings if they don't exist
    return prisma.siteSetting.create({
      data: {
        id: 1,
        siteName: data.siteName || "Cyberpunk Blog",
        siteDescription: data.siteDescription || "A modern blog for cyberpunk enthusiasts",
        ...data,
      },
    });
  }
};

// Reset settings to default
export const resetSiteSettings = async () => {
  const defaultSettings = {
    siteName: "Cyberpunk Blog",
    siteDescription: "A modern blog for cyberpunk enthusiasts",
    postsPerPage: 10,
    darkMode: false,
    showTags: true,
    showCategories: true,
    enableComments: true,
    enableBanner: false,
    copyrightText: `© ${new Date().getFullYear()} Cyberpunk Blog`,
  };

  return prisma.siteSetting.upsert({
    where: { id: 1 },
    update: defaultSettings,
    create: {
      id: 1,
      ...defaultSettings,
    },
  });
};
