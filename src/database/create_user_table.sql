CREATE TABLE `User`(
	`id` SERIAL PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) UNIQUE,
    `cellPhoneNumber` VARCHAR(20) UNIQUE,
    `password` VARCHAR(40) NOT NULL,
    `birthday` DATE NOT NULL,
    `gender` VARCHAR(100) NOT NULL,
    `genderAlias` VARCHAR(10) NOT NULL,
    
    CONSTRAINT `id_must_have` CHECK (`email` iS NOT NULL OR `cellPhoneNumber` is NOT NULL)
);