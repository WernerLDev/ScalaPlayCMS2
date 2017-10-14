
# Code generated schema

# --- !Ups

CREATE TABLE `authors` ( 
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);

CREATE TABLE `posts` ( 
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `category_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);

CREATE TABLE `categories` ( 
  `id` INT NOT NULL AUTO_INCREMENT,
  `categoryname` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);

CREATE TABLE `comments` ( 
  `id` INT NOT NULL AUTO_INCREMENT,
  `message` TEXT NOT NULL,
  `author_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);

CREATE TABLE `projects` ( 
  `id` INT NOT NULL AUTO_INCREMENT,
  `Projectname` VARCHAR(255) NOT NULL,
  `Description` TEXT NOT NULL,
  `ProjectDate` DATETIME NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC)
);

CREATE TABLE `postcomments` (
  `source_id` INT NOT NULL,
  `target_id` INT NOT NULL,
  PRIMARY KEY (`source_id`,`target_id`),
  CONSTRAINT `postcomments_posts_FK` FOREIGN KEY (`source_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `postcomments_comments_FK` FOREIGN KEY (`target_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `postprojects` (
  `source_id` INT NOT NULL,
  `target_id` INT NOT NULL,
  PRIMARY KEY (`source_id`,`target_id`),
  CONSTRAINT `postprojects_posts_FK` FOREIGN KEY (`source_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `postprojects_projects_FK` FOREIGN KEY (`target_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `projectcategories` (
  `source_id` INT NOT NULL,
  `target_id` INT NOT NULL,
  PRIMARY KEY (`source_id`,`target_id`),
  CONSTRAINT `projectcategories_projects_FK` FOREIGN KEY (`source_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `projectcategories_categories_FK` FOREIGN KEY (`target_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);



ALTER TABLE `posts` ADD INDEX (category_id);
ALTER TABLE `posts` ADD INDEX (author_id);

ALTER TABLE `comments` ADD INDEX (author_id);





# --- !Downs
DROP TABLE `postcomments`;
DROP TABLE `postprojects`;
DROP TABLE `projectcategories`;
DROP TABLE `authors`;
DROP TABLE `posts`;
DROP TABLE `categories`;
DROP TABLE `comments`;
DROP TABLE `projects`;
