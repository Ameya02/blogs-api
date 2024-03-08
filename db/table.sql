DROP TABLE IF EXISTS Comment, Post, Users;

CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Comment (
    id SERIAL PRIMARY KEY,
    comment_text TEXT NOT NULL,
    user_id INT,
    post_id INT,
    FOREIGN KEY (user_id) REFERENCES "Users"(id),
    FOREIGN KEY (post_id) REFERENCES Post(id)
);

CREATE TABLE Post (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    post_text TEXT NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES "Users"(id)
);

