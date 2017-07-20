# entity schema

# --- !Ups

CREATE TABLE `entities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `object_id` INT NULL,
  `parent_id` INT NULL,
  `name` VARCHAR(255) NULL,
  `discriminator` VARCHAR(255) NULL,
  `created_at` DATETIME NULL DEFAULT NOW(),
  `published_at` DATETIME NULL DEFAULT NOW(),
  `updated_at` DATETIME NULL DEFAULT NOW(),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));


# --- !Downs
drop table `entities`;