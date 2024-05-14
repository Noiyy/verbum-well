USE verbumwell;

-- DROP TABLE IF EXISTS headings, subHeadings, paragraphs, images, linebreaks, users, comments, posts;
 DROP TABLE IF EXISTS headings, subHeadings, paragraphs, images, linebreaks, comments, posts;

-- CREATE TABLE IF NOT EXISTS users (
-- 	id INT NOT NULL AUTO_INCREMENT,
--     name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     salt VARCHAR(255) NOT NULL,
--     isAdmin BOOLEAN NOT NULL DEFAULT 0,
--     hasPremium BOOLEAN NOT NULL DEFAULT 0,
--     dateCreatedS INT NOT NULL,
--     avatarLocation VARCHAR(255) NULL,
--     PRIMARY KEY (id)
-- );

CREATE TABLE IF NOT EXISTS posts (
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
	userId INT NOT NULL,
    dateCreatedS INT NOT NULL DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS comments (
	id INT NOT NULL AUTO_INCREMENT,
    userId INT NOT NULL,
    postId INT NOT NULL,
    likeCount INT NOT NULL DEFAULT 0,
    dateCreatedS INT NOT NULL DEFAULT 0,
    content VARCHAR(512) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (postId) REFERENCES posts(id),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS headings (
	id INT NOT NULL AUTO_INCREMENT,
    content VARCHAR(255) NOT NULL,
    postId INT NOT NULL,
    pos INT NOT NULL DEFAULT 0,
    FOREIGN KEY (postId) REFERENCES posts(id),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS subHeadings (
	id INT NOT NULL AUTO_INCREMENT,
    content VARCHAR(255) NOT NULL,
    postId INT NOT NULL,
    headingId INT NOT NULL,
    pos INT NOT NULL,
    FOREIGN KEY (postId) REFERENCES posts(id),
    FOREIGN KEY (headingId) REFERENCES headings(id),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS paragraphs (
	id INT NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    postId INT NOT NULL,
    pos INT NOT NULL,
    FOREIGN KEY (postId) REFERENCES posts(id),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS images (
	id INT NOT NULL AUTO_INCREMENT,
    imgLocation TEXT NOT NULL,
    imgAlt VARCHAR(255),
    creditName VARCHAR(255),
    creditLink VARCHAR(255),
    postId INT NOT NULL,
    pos INT NOT NULL,
    FOREIGN KEY (postId) REFERENCES posts(id),
	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS linebreaks (
	id INT NOT NULL AUTO_INCREMENT,
    postId INT NOT NULL,
    pos INT NOT NULL,
    FOREIGN KEY (postId) REFERENCES posts(id),
	PRIMARY KEY (id)
);

INSERT INTO posts (title, userId, dateCreatedS) VALUES ('Wonders of life', 1, UNIX_TIMESTAMP(NOW()));

INSERT INTO headings (content, postId, pos) VALUES ('Introduction', 1, 0);
INSERT INTO paragraphs (content, postId, pos) VALUES ("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.", 1, 1);
INSERT INTO linebreaks (postId, pos) VALUES (1, 2);
INSERT INTO paragraphs (content, postId, pos) VALUES ("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.", 1, 3);
INSERT INTO images(imgLocation, postId, creditName, creditLink, pos) VALUES ("assets/img/pg_semestralka-2-s.jpg", 1, "Noiyy", "https://noiyy.eu/", 4);
INSERT INTO linebreaks (postId, pos) VALUES (1, 5);
INSERT INTO subHeadings(content, postId, headingId, pos) VALUES ("Sub introduction", 1, 1, 6);
INSERT INTO paragraphs (content, postId, pos) VALUES ("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.", 1, 7);
INSERT INTO linebreaks (postId, pos) VALUES (1, 8);
INSERT INTO linebreaks (postId, pos) VALUES (1, 9);
INSERT INTO headings (content, postId, pos) VALUES ('Overview', 1, 10);
INSERT INTO paragraphs (content, postId, pos) VALUES ("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.", 1, 11);

INSERT INTO comments (userId, postId, content, dateCreatedS) VALUES (2, 1, "Mlem. Very meow.        wooow", UNIX_TIMESTAMP(NOW()));

