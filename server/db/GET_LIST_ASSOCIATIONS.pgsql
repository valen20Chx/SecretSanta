SELECT * FROM association
WHERE gifter_id IN (
    SELECT id FROM participant
    WHERE list_id = $1
);