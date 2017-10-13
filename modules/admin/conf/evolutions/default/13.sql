
# Code generated schema

# --- !Ups

CREATE TABLE `posts` ( 
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);

CREATE TABLE `categories` ( 
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `categoryname` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);

CREATE TABLE `projects` ( 
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `Projectname` VARCHAR(255) NOT NULL,
  `Description` TEXT NOT NULL,
  `ProjectDate` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);

CREATE TABLE `projectcategories` (
  `source_id` INT NOT NULL,
  `target_id` INT NOT NULL
);


ALTER TABLE `posts` ADD INDEX (category_id);




# --- !Downs
DROP TABLE `posts`;
DROP TABLE `categories`;
DROP TABLE `projects`;
DROP TABLE `projectcategories`;
