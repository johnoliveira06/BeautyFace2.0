CREATE DATABASE `beautyface`;

USE `beautyface`;

CREATE TABLE IF NOT EXISTS `users`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha` VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS `products`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(255) NOT NULL,
    `preco` DECIMAL(8, 2) NOT NULL,
    `imagem` VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS `adresses`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT NOT NULL,
    `logradouro` VARCHAR(100) NOT NULL,
    `numero` VARCHAR(10) NOT NULL,
    `bairro` VARCHAR(50) NOT NULL,
    `cidade` VARCHAR(50) NOT NULL,
    `estado` VARCHAR(6) NOT NULL,
    `cep` VARCHAR(10) NOT NULL,
    CONSTRAINT userId FOREIGN KEY (userId) REFERENCES users (id)
);
CREATE TABLE IF NOT EXISTS `cart`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT NOT NULL,
    `produtoId` INT NOT NULL,
    `quantidade` INT NOT NULL,
    `nome` VARCHAR(255) NOT NULL,
    `preco` DECIMAL(8, 2) NOT NULL,
    `imagem` VARCHAR(255) NOT NULL,
    CONSTRAINT produtoId FOREIGN KEY (produtoId) REFERENCES products (id),
    CONSTRAINT userId_2 FOREIGN KEY (userId) REFERENCES users (id)
);
CREATE TABLE IF NOT EXISTS `orders`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` INT NOT NULL,
    `total` DECIMAL(8, 2) NOT NULL,
    `data` DATE NOT NULL,
    CONSTRAINT userId_3 FOREIGN KEY (userId) REFERENCES users (id)
);
CREATE TABLE IF NOT EXISTS `order_details`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `pedidoId` INT NOT NULL,
    `produtoId` INT NOT NULL,
    `quantidade` INT NOT NULL,
    `valorUnitario` DECIMAL(8, 2) NOT NULL,
    CONSTRAINT pedidoId FOREIGN KEY (pedidoId) REFERENCES orders (id),
    CONSTRAINT produtoId_2 FOREIGN KEY (produtoId) REFERENCES products (id)
);

-- INSERÇÃO DE PRODUTOS
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL, 'Sabonete',20.00,'sabonete.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Shampoo',15.00,'shampoo.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Kit Shampoo',30.00,'kitShampoo.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Shampoo Aloe Vera',20.00,'shampoo2.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Creme Facial',25.00,'cremeFacial.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Perfume',80.00,'perfume.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Protetor Solar',35.00,'protetorSolar.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Kit Creme',70.00,'kitCreme.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Anti Rugas',40.00,'antiRugas.jpg');