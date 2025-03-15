from helper_modules import util as ut, db_helper as db

query = """
        select min(recorded_datetime)
        from Infrared
        """

print(db.fetch_data(query))