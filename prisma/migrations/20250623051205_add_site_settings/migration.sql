-- CreateTable
CREATE TABLE `SiteSetting` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `siteName` VARCHAR(191) NOT NULL,
    `siteDescription` VARCHAR(191) NOT NULL,
    `logoUrl` VARCHAR(191) NULL,
    `themeColor` VARCHAR(191) NULL,
    `headerImageUrl` VARCHAR(191) NULL,
    `darkMode` BOOLEAN NOT NULL DEFAULT false,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `metaKeywords` VARCHAR(191) NULL,
    `ogImageUrl` VARCHAR(191) NULL,
    `facebookUrl` VARCHAR(191) NULL,
    `twitterUrl` VARCHAR(191) NULL,
    `lineUrl` VARCHAR(191) NULL,
    `contactEmail` VARCHAR(191) NULL,
    `copyrightText` VARCHAR(191) NULL,
    `socialLinks` JSON NULL,
    `postsPerPage` INTEGER NOT NULL DEFAULT 10,
    `showTags` BOOLEAN NOT NULL DEFAULT true,
    `showCategories` BOOLEAN NOT NULL DEFAULT true,
    `enableComments` BOOLEAN NOT NULL DEFAULT true,
    `analyticsId` VARCHAR(191) NULL,
    `enableBanner` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
