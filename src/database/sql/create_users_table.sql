

CREATE TYPE user_role AS ENUM ('admin', 'atendente');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'atendente',
    created_at TIMESTAMP NOT NULL DEFAULT now()
);