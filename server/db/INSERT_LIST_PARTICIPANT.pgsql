INSERT INTO participant(list_id, name, email, date_added)
VALUES($1, $2, $3, CURRENT_DATE)
returning id;