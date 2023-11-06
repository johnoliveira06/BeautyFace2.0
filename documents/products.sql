CREATE TABLE IF NOT EXISTS products (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  preco VARCHAR(255) NOT NULL,
  imagem VARCHAR(255) NOT NULL,
  PRIMARY KEY (id))
ENGINE = InnoDB;

INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL, 'Sabonete','20, 00','sabonete.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Shampoo','15, 00','shampoo.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Kit Shampoo','30, 00','kitShampoo.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Shampoo Aloe Vera','20, 00','shampoo2.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Creme Facial','25, 00','cremeFacial.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Perfume','80, 00','perfume.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Protetor Solar','35, 00','protetorSolar.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Kit Creme','70, 00','kitCreme.jpg');
INSERT INTO `products`(`id`, `nome`, `preco`, `imagem`) VALUES (NULL,'Anti Rugas','40, 00','antiRugas.jpg');