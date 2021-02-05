import json
import pickle
from collections import OrderedDict

from tfidf import *
from bson import json_util, ObjectId
from flask import Flask, render_template, request, jsonify
from flask_wtf import FlaskForm
from flask_bootstrap import Bootstrap
from flask_pymongo import PyMongo
from flask_cors import CORS


app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
CORS(app)
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

@app.route('/result', methods=['POST', 'GET'])
def home():
    query = request.args.get('q')
    page_size = request.args.get('page_size')
    page_number = request.args.get('page_number')
    with open('index.pkl', 'rb') as f:
        index = pickle.load(f)
    if query is None:
        results = []
    else:
        results = tfidf(index[0], index[1], query)
    out = {}
    if page_size is None:
        page_size = 10
    if page_number is None:
        page_number = 1
    for r in results[int(page_number)-1:int(page_number)+int(page_size)]:

        artwork = mongo.db.art.find_one({'_id': ObjectId(r[0])})
        out[r[0]] = artwork

    return json.loads(json_util.dumps(out))

@app.route('/artist', methods=['POST', 'GET'])
def artist():
    artist = request.args.get('artist')
    artwork = mongo.db.art.find({'author': artist})
    out = {}
    for a in list(artwork):
        id = str(a.get('_id'))
        out[id] = a

    return json.loads(json_util.dumps(out))

if __name__ == '__main__':
    app.run(debug=True)
