import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Shabi2333!", 
        database="fresh_footwear",
    )
