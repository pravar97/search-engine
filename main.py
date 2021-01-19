from flask import Flask, render_template, request
from flask_wtf import FlaskForm
from flask_bootstrap import Bootstrap
from flask_pymongo import PyMongo


app = Flask(__name__)
Bootstrap(app)
app.config['SECRET_KEY'] = 'hijhih'
app.config['MONGO_URI'] = \
    "mongodb+srv://jacob:1mfeelingartsy@artdb-cluster.genfb.mongodb.net/artdb?retryWrites=true&w=majority"
mongo = PyMongo(app)
'''
Table: artists
Columns: _id, author, birth_year, birth_place, death_year, death_place, description

Table: artworks
Columns: _id, 
'''


@app.route('/', methods=['POST', 'GET'])
def home():
    artist = mongo.db.artists.find_one({"birth_year": 1552})
    print(type(artist))
    for doc in artist:
        print(doc)
    return str(artist["author"])


if __name__ == '__main__':
    app.run(debug=True)
