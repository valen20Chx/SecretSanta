INSERT INTO list(date_created, max_participants)
VALUES(CURRENT_DATE, $1)
returning id;