import mysql.connector

def get_connection():
    """
    Creates and returns a connection to the fresh_footwear MySQL database.
    Make sure the 'fresh_footwear' DB and its tables are imported from your .sql files.
    """
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Temple.Run2",  # change this if your MySQL has a password
        database="fresh_footwear",
    )
