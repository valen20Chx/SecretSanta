CREATE TABLE IF NOT EXISTS list
(
    id serial UNIQUE NOT NULL,
    date_created date NOT NULL,
    scrambled boolean DEFAULT FALSE NOT NULL,
    max_participants integer NOT NULL,
    CONSTRAINT "LIST_pkey" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS participant
(
    id serial UNIQUE NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    date_added date NOT NULL,
    creator boolean DEFAULT FALSE NOT NULL,
    list_id serial NOT NULL,
    CONSTRAINT "PARTICIPANT_pkey" PRIMARY KEY (id),
    CONSTRAINT "LIST_fkey"
        FOREIGN KEY(list_id)
            REFERENCES list(id)
);

CREATE TABLE IF NOT EXISTS association
(
    id serial UNIQUE NOT NULL,
    gifter_id serial NOT NULL,
    receiver_id serial NOT NULL,
    date_created date NOT NULL,
    CONSTRAINT "ASSOCIATION_pkey" PRIMARY KEY (id),
    CONSTRAINT "RECEIVER_fkey"
        FOREIGN KEY(receiver_id)
            REFERENCES participant(id),
    CONSTRAINT "GIFTER_fkey"
        FOREIGN KEY(gifter_id)
            REFERENCES participant(id)
);