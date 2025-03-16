from helper_modules import util as ut,db_helper as db

query2 = """
        WITH InfraredNearby AS (
            SELECT i.latitude, i.longitude, i.count, i.recorded_datetime, e.id, e.name,
                (6371000 * acos(
                    cos(radians(e.latitude)) * cos(radians(i.latitude)) * 
                    cos(radians(i.longitude) - radians(e.longitude)) + 
                    sin(radians(e.latitude)) * sin(radians(i.latitude))
                )) AS distance_m
            FROM Infrared i
            JOIN Event e ON 1=1  -- Cartesian join to compare all event-infrared pairs
        ),
        RankedData AS (
            SELECT id, name, latitude, longitude, count, recorded_datetime, distance_m,
                ROW_NUMBER() OVER (
                    PARTITION BY latitude, longitude 
                    ORDER BY recorded_datetime DESC
                ) AS rn
            FROM InfraredNearby
            WHERE distance_m <= 100
        )
        SELECT e.id, e.name, e.latitude, e.longitude, COALESCE(SUM(r.count), 0) AS total_count
        FROM Event e
        LEFT JOIN RankedData r ON e.id = r.id
        WHERE r.rn = 1 OR r.rn IS NULL  -- Include events even if no matching data in Infrared
        GROUP BY e.id, e.name, e.latitude, e.longitude;
        """

query = """
        WITH InfraredNearby AS (
            SELECT i.latitude AS infrared_lat, i.longitude AS infrared_lon, i.count, i.recorded_datetime, 
                a.latitude AS alert_lat, a.longitude AS alert_lon, a.radius, a.threshold,
                (6371000 * acos(
                    cos(radians(a.latitude)) * cos(radians(i.latitude)) * 
                    cos(radians(i.longitude) - radians(a.longitude)) + 
                    sin(radians(a.latitude)) * sin(radians(i.latitude))
                )) AS distance_m
            FROM Infrared i
            JOIN Alerts a ON 1=1  -- Cartesian join to compare all alert-infrared pairs
        ),
        RankedData AS (
            SELECT alert_lat, alert_lon, infrared_lat, infrared_lon, count, recorded_datetime, distance_m, radius, threshold,
                ROW_NUMBER() OVER (
                    PARTITION BY infrared_lat, infrared_lon 
                    ORDER BY recorded_datetime DESC
                ) AS rn
            FROM InfraredNearby
            WHERE distance_m <= radius  -- Use alert-specific radius
        )
        SELECT a.latitude, a.longitude, COALESCE(SUM(r.count), 0) AS total_count
        FROM Alerts a
        LEFT JOIN RankedData r 
            ON a.latitude = r.alert_lat 
            AND a.longitude = r.alert_lon
            AND r.rn = 1  -- Ensure only the most recent sensor reading per lat-lon is used
        GROUP BY a.latitude, a.longitude, a.threshold
        HAVING COALESCE(SUM(r.count), 0) >= a.threshold;
        """

print(db.fetch_data(query2))
print(db.fetch_data(query))
print(db.fetch_data("select * from alerts"))
# ut.fetch_and_print_all_tables()