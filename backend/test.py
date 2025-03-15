from helper_modules import util as ut,db_helper as db
ut.fetch_and_print_all_tables()
print(db.execute_query("select * from Infrared"))