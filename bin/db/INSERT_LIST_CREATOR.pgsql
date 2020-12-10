INSERT INTO participant(list_id, name, email, date_added, creator)
VALUES($1, $2, $3, CURRENT_DATE, TRUE)
returning id;