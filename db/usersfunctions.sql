--Users Function
--This function is used to create a new user in the database. It takes in three parameters: username, email, and password. It returns the newly created user.
CREATE OR REPLACE FUNCTION create_user(
    p_username VARCHAR(50),
    p_email VARCHAR(100),
    p_password VARCHAR(255)
) RETURNS "Users" AS
$$
DECLARE
    new_user "Users"%ROWTYPE;
BEGIN
    INSERT INTO "Users" (username, email, password)
    VALUES (p_username, p_email, p_password)
    RETURNING * INTO new_user;

    RETURN new_user;
END;
$$
LANGUAGE plpgsql;

--This function is used to update the details of a user in the database. It takes in three parameters: user_id, username, and password. It updates the user details and does not return anything.
CREATE OR REPLACE FUNCTION update_user_details(
    p_user_id INT,
    p_username VARCHAR(50),
    p_password VARCHAR(255)
) RETURNS VOID AS
$$
BEGIN
    UPDATE users
    SET username = p_username,
        password = p_password
    WHERE users.id = p_user_id;
END;
$$
LANGUAGE plpgsql;

--This function is used to delete a user from the database. It takes in one parameter: user_id. It deletes the user from the database and does not return anything.
CREATE OR REPLACE FUNCTION delete_user(
    p_user_id INT
) RETURNS VOID AS
$$
BEGIN
    DELETE FROM users
    WHERE id = p_user_id;
END;
$$
LANGUAGE plpgsql;

--This function is used to get a user by their ID. It takes in one parameter: user_id. It returns the user details (id, username, email) for the specified user.
CREATE OR REPLACE FUNCTION get_user_by_id(
    p_user_id INT
) RETURNS TABLE (
    id INT,
    username VARCHAR(50),
    email VARCHAR(100)
) AS
$$
BEGIN
    RETURN QUERY
    SELECT id, username, email
    FROM users
    WHERE id = p_user_id;
END;
$$
LANGUAGE plpgsql;

--This function is used to get all the users details like its post or comments etc
CREATE OR REPLACE FUNCTION get_user_data(
    p_user_id INT
) RETURNS TABLE (
    post_id INT,
    post_title VARCHAR(255),
    post_text TEXT,
    comment_id INT,
    comment_text TEXT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id AS post_id,
        p.title AS post_title,
        p.post_text,
        c.id AS comment_id,
        c.comment_text
    FROM
        post p
    LEFT JOIN
        comment c ON p.id = c.post_id
    WHERE
        p.user_id = p_user_id OR c.user_id = p_user_id;
    
END;
$$ LANGUAGE plpgsql;

