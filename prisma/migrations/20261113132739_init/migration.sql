-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `resumo` TEXT NULL,
    ADD COLUMN `senhaHash` VARCHAR(64) NULL,
    ADD COLUMN `senhaSalt` VARCHAR(64) NULL,
    ADD COLUMN `titulo` VARCHAR(120) NULL,
    MODIFY `foto` LONGTEXT NULL;

-- CreateTable
CREATE TABLE `atividades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `nome` VARCHAR(255) NOT NULL,
    `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `atividades_usuarioId_idx`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `progresso_aulas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `aula` INTEGER NOT NULL,
    `concluidaEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `progresso_aulas_usuarioId_aula_key`(`usuarioId`, `aula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `avaliacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alunoId` INTEGER NOT NULL,
    `profissionalId` INTEGER NULL,
    `profissionalNome` VARCHAR(150) NOT NULL,
    `nota` INTEGER NOT NULL,
    `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `avaliacoes_alunoId_idx`(`alunoId`),
    INDEX `avaliacoes_profissionalId_idx`(`profissionalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contatos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `mensagem` TEXT NOT NULL,
    `dataCriacao` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `atividades` ADD CONSTRAINT `atividades_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `progresso_aulas` ADD CONSTRAINT `progresso_aulas_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `avaliacoes` ADD CONSTRAINT `avaliacoes_profissionalId_fkey` FOREIGN KEY (`profissionalId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
