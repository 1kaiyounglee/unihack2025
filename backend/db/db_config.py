import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# catch the database URL from the environment variables, or use a default
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f'sqlite:///{os.path.join(BASE_DIR, "unihack.db")}'

# create the engine
engine = create_engine(DATABASE_URL)

# create a sessionmaker factory that binds to the engine
Session = sessionmaker(bind=engine)
