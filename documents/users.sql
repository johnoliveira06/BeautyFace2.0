CREATE DATABASE `beautyface`;

USE `beautyface`;

CREATE TABLE IF NOT EXISTS `beautyface`.`users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `cidade` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

INSERT INTO `users`(`id`, `nome`, `email`, `senha`, `cidade`) VALUES (NULL,'john','john@gmail.com','12345','santarém');
INSERT INTO `users`(`id`, `nome`, `email`, `senha`, `cidade`) VALUES (NULL,'nome','nome@gmail.com','123456','cidade');