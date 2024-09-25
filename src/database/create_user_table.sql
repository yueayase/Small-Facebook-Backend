USE MyFacebookDatabase;
CREATE TABLE IF NOT exists `User` (
    `id` SERIAL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(40) NOT NULL,
    `birthday` DATE NOT NULL,
    `gender` VARCHAR(100) NOT NULL,
    `genderAlias` VARCHAR(10) NOT NULL,
    `coverImage` varchar(255) DEFAULT '',
    `userIcon` varchar(255) DEFAULT ''
);
CREATE TABLE IF NOT exists `UserEmail` (
    `userId` BIGINT UNSIGNED PRIMARY KEY,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
);
CREATE TABLE IF NOT exists `UserCellPhone` (
    `userId` BIGINT UNSIGNED PRIMARY KEY,
    `cellPhoneNumber` VARCHAR(20) UNIQUE NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS `ExistUsername`(
	`username` VARCHAR(255) PRIMARY KEY NOT NULL,
    `amount` INT(11) DEFAULT 0
);
CREATE TABLE IF NOT EXISTS `UserUrl` (
	`userId` BIGINT UNSIGNED PRIMARY KEY,
    `url` VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
);