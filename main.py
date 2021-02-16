import json

from tfidf import tfidf
from flask import Flask, render_template, request, jsonify


from flask_pymongo import PyMongo, ObjectId
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


    if query is None:
        results = []
    else:
        results = tfidf(query)

    out = {}
    
    for a in mongo.db.art.find({'id': {'$in': results[:5000]}}):
        a.pop('_id')
        out[a['id']] = a

    return out


@app.route('/get_results', methods=['POST', 'GET'])
def get_results():    
        
    query = request.args.get('q')

    if query is None:
        results = []
    else:
        results = tfidf(query)

    return dict(enumerate(results))


@app.route('/results2db', methods=['POST', 'GET'])
def results2db():    
        
    r = request.args.get('r')

    if r is None:
        results = []
    else:
        results = r.split('_')

    out = {}    
    for a in mongo.db.art.find({'id': {'$in': results[:5000]}}):
        a.pop('_id')
        out[a['id']] = a

    return out


@app.route('/artist', methods=['POST', 'GET'])
def artist():
    artist = request.args.get('artist')
    artwork = mongo.db.art.find({"AUTHOR": artist})
    out = {}
    for a in list(artwork):
        id = str(a.get('_id'))
        out[id] = a
        out[id].pop('_id')

    return out

if __name__ == '__main__':
    app.run(debug=True)
