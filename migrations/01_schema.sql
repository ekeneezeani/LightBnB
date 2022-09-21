CREATE TABLE users(
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL,
password VARCHAR(255) NOT NULL
);

CREATE TABLE properties (
id SERIAL PRIMARY KEY,
owner_id INTEGER,
title VARCHAR(255),
description TEXT,
thumbnail_photo_url VARCHAR(255),
cover_photo_url VARCHAR(255),
cost_per_night INTEGER,
parkin_spaces INTEGER,
number_of_bathrooms INTEGER,
number_of_bedrooms INTEGER,
country VARCHAR(255),
street VARCHAR(255),
city VARCHAR(255),
province VARCHAR(255),
post_code VARCHAR(255),
active BOOLEAN
);

CREATE TABLE reservations(
id SERIAL PRIMARY KEY,
start_date DATE NOT NULL,
end_date DATE NOT NULL,
property_id INTEGER NOT NULL,
guest_id INTEGER  NOT NULL
);

CREATE TABLE property_reviews(
id SERIAL PRIMARY KEY,
guest_id INTEGER,
property_id INTEGER,
reservation_id INTEGER,
rating SMALLINT,
message TEXT
);



