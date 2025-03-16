from helper_modules import util as ut,db_helper as db

query = """
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
# print(db.fetch_data(query))
ut.fetch_and_print_all_tables()