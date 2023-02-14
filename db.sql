CREATE SCHEMA IF NOT EXISTS sminex;
SET search_path TO sminex;

START TRANSACTION;

CREATE TABLE users (
    user_id serial NOT NULL,
    login text NOT NULL,
    passhash text NOT NULL,
    token text DEFAULT NULL,
    admin boolean NOT NULL DEFAULT false,
    active boolean NOT NULL DEFAULT true,
    PRIMARY KEY (user_id),
    UNIQUE (login)
);

CREATE TABLE classifiers (
    cl_id serial NOT NULL,
    code text NOT NULL,
    description text NOT NULL,
    level smallint,
    parent_id int NOT NULL,
    PRIMARY KEY (cl_id),
    UNIQUE (code)
);

CREATE INDEX classifiers_parent_id_idx ON classifiers (parent_id);

CREATE FUNCTION classifiers_auto_delete() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM classifiers WHERE parent_id = OLD.cl_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER classifiers_auto_delete_trig BEFORE DELETE ON classifiers
    FOR EACH ROW EXECUTE FUNCTION sminex.classifiers_auto_delete();

CREATE USER sminex_admin;
GRANT SELECT, INSERT, UPDATE ON users TO sminex_admin;
GRANT SELECT, INSERT ON classifiers TO sminex_admin;

CREATE USER sminex_client;
GRANT SELECT, UPDATE (token) ON users TO sminex_client;
GRANT SELECT ON classifiers TO sminex_client;

INSERT INTO users (login, passhash, admin)
    VALUES ('admin', '$2b$10$xrLbSlwa76tmApaXLvZ07uixJtPiEKjqmtLxNMOmyaynS35xz/itm', true);

COMMIT;
