ALTER TABLE users
    ADD COLUMN date_of_birth DATE NULL,
    ADD COLUMN gender VARCHAR(30) NULL,
    ADD COLUMN emergency_contact_name VARCHAR(100) NULL,
    ADD COLUMN emergency_contact_relationship VARCHAR(50) NULL,
    ADD COLUMN emergency_contact_phone VARCHAR(20) NULL;
