CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE
);

CREATE TABLE user_contacts (
    user_id INTEGER NOT NULL,
    contact_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, contact_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contacts (id) ON DELETE CASCADE
);

INSERT INTO users (username, password, email) VALUES
('user1', 'pass1', 'user1@example.com'),
('user2', 'pass2', 'user2@example.com');

INSERT INTO contacts (firstName, lastName, email, phone) VALUES
('Jessica', 'Chapman', 'nealandrew@johnson-henson.com', '(613)187-9227'),
('Shawn', 'Jefferson', 'cardenasdaniel@burnett.biz', '001-634-104-9518x9011'),
('Adam', 'Evans', 'butlerjimmy@kane-jones.com', '(637)086-1351'),
('Stephanie', 'Hill', 'qhill@marsh-miller.com', '+1-127-424-4264x422'),
('Donald', 'Johnson', 'zeverett@yahoo.com', '+1-815-818-6249x794');

INSERT INTO user_contacts (user_id, contact_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(2, 5);
