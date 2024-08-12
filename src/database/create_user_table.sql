USE MyFacebookDatabase;
CREATE TABLE `User` (
    `id` SERIAL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(40) NOT NULL,
    `birthday` DATE NOT NULL,
    `gender` VARCHAR(100) NOT NULL,
    `genderAlias` VARCHAR(10) NOT NULL
);
CREATE TABLE `UserEmail` (
    `userId` BIGINT UNSIGNED PRIMARY KEY,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
);
CREATE TABLE `UserCellPhone` (
    `userId` BIGINT UNSIGNED PRIMARY KEY,
    `cellPhoneNumber` VARCHAR(20) UNIQUE NOT NULL,
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE
);