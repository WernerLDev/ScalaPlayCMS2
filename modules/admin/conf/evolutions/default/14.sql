
# Code generated schema

# --- !Ups

CREATE TABLE `authors` ( 
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `dateofbirth` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);

CREATE TABLE `posts` ( 
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `category_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);

CREATE TABLE `categories` ( 
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `categoryname` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);

CREATE TABLE `comments` ( 
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `message` TEXT NOT NULL,
  `author_id` INT NOT NULL,
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

CREATE TABLE `authorprojects` (
  `source_id` INT NOT NULL,
  `target_id` INT NOT NULL
);


CREATE TABLE `postcomments` (
  `source_id` INT NOT NULL,
  `target_id` INT NOT NULL
);


CREATE TABLE `postprojects` (
  `source_id` INT NOT NULL,
  `target_id` INT NOT NULL
);


CREATE TABLE `projectcategories` (
  `source_id` INT NOT NULL,
  `target_id` INT NOT NULL
);



ALTER TABLE `posts` ADD INDEX (category_id);
ALTER TABLE `posts` ADD INDEX (author_id);

ALTER TABLE `comments` ADD INDEX (author_id);






# --- !Downs
DROP TABLE `authors`;
DROP TABLE `posts`;
DROP TABLE `categories`;
DROP TABLE `comments`;
DROP TABLE `projects`;
DROP TABLE `authorprojects`;
DROP TABLE `postcomments`;
DROP TABLE `postprojects`;
DROP TABLE `projectcategories`;
