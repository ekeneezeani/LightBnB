const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  const queryString = `SELECT * FROM users
  WHERE email = $1;`;
  return pool
    .query(queryString, [email])
    .then((result) => {
      console.log(result.rows);
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => {
      // console.log(err);
      return err;
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  const queryString = `SELECT * FROM users
  WHERE id = $1;`;
  return pool
    .query(queryString, [id])
    .then((result) => {
      // console.log(result.rows);
      return result.rows[0];
    })
    .catch((err) => {
      // console.log(err);
      return err;
    });
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const queryString = `INSERT INTO users(name,email,password)
  VALUES($1, $2, $3)
  RETURNING *;`;
  return pool
    .query(queryString, [user.name, user.email, user.password])
    .then((res) => {
      console.log(res);
      return res.rows[0];
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (user) {
  console.log("USER", user);
  const queryString = `SELECT properties.*, reservations.*, avg(rating) as average_rating
                        FROM reservations
                        JOIN properties ON reservations.property_id = properties.id
                        JOIN property_reviews ON properties.id = property_reviews.property_id
                        WHERE reservations.guest_id = $1
                        GROUP BY reservations.id,properties.id
                        ORDER BY reservations.start_date;`;

  return pool
    .query(queryString, [user])
    .then((res) => {
      console.log("LINE 97", res.rows);
      return res.rows;
    })
    .catch((err) => {
      console.log("RESERVATIONS ERROR", err);
      return err;
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1=1
  `;

  // 3
  if (options.owner_id) {
    queryParams.push(`%${options.owner_id}%`);
    queryString += ` AND owner_id = $${queryParams.length}`;
  }

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` AND city LIKE $${queryParams.length}`;
  }

  if(options.minimum_price_per_night) {
    queryParams.push(`%${options.minimum_price_per_night}%`);
    queryString += ` AND properties.cost_per_night/100 >= $${queryParams.length}`;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`%${options.maximum_price_per_night}%`);
    queryString += ` AND properties.cost_per_night/100 <= $${queryParams.length}`
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`%${options.minimum_price_per_night}%`);
    queryParams.push(`%${options.maximum_price_per_night}%`);
    queryString += ` AND properties.cost_per_night/100 >= $${queryParams.length-1} AND properties.cost_per_night/100 <=$${queryParams.length} `
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
