DROP DATABASE IF EXISTS company_info;
CREATE DATABASE company_info;

\c company_info;

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
 name VARCHAR(30)  UNIQUE NOT NULL
);

CREATE TABLE role (
    id serial PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR (30)NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER
);
