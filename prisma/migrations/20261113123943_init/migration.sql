-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(20) NULL,
    `googleId` VARCHAR(64) NULL,
    `foto` TEXT NULL,
    `pro` BOOLEAN NOT NULL DEFAULT false,
    `crefito` VARCHAR(40) NULL,
    `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_telefone_key`(`telefone`),
    UNIQUE INDEX `usuarios_googleId_key`(`googleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
