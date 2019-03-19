-- Up
CREATE TABLE message (
  id INTEGER PRIMARY KEY,
  author TEXT,
  entry TEXT
);

INSERT INTO message (id, author, entry) VALUES (1, 'TEST USER1', 'FIRST MESSAGE');
INSERT INTO message (id, author, entry) VALUES (2, 'TEST USER2', 'SECOND MESSAGE');

-- Down
DROP TABLE message;
