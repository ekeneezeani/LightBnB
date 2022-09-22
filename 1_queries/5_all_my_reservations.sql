SELECT reservations.id, properties.title, reservations.start_date, properties.cost_per_night, AVG(property_reviews.rating)
FROM reservations
JOIN properties ON properties.id = property_id
JOIN property_reviews ON property_reviews.reservation_id = reservations.id
GROUP BY reservations.id,properties.id
HAVING reservations.guest_id = 1
ORDER BY start_date ASC
LIMIT 10;