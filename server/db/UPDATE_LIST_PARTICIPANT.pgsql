UPDATE
    participant
SET
    name = $2,
    email = $3
WHERE
    id = $1;