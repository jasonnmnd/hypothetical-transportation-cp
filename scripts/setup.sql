CREATE DATABASE admin;
CREATE USER admin WITH ENCRYPTED PASSWORD 'admin';
ALTER ROLE admin SET client_encoding TO 'utf8';
ALTER ROLE admin SET default_transaction_isolation TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE admin TO admin;