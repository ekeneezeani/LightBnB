SELECT properties.city, count(reservations.*) AS total_reservations
FROM properties
JOIN reservations ON property_id = reservations.id
GROUP BY city
ORDER BY total_reservations DESC;