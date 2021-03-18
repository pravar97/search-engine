import json
from rank import rank, advanced_rank
from flask import Flask, render_template, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS
from collections import OrderedDict


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
        results = rank(query, bm25=True)

    out = dict.fromkeys(results[:5000])

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
        results = rank(query, True)

    return dict(enumerate(results))


@app.route('/results2db', methods=['POST', 'GET'])
def results2db():

    r = request.args.get('r')

    if r is None:
        results = []
    else:
        results = list(json.loads(r))

    keys = results[:5000]
    out = OrderedDict((k, None) for k, _ in enumerate(keys))
    for a in mongo.db.art.find({'id': {'$in': results[:5000]}}):
        a.pop('_id')
        out[keys.index(a['id'])] = a
    return dict(out)


@app.route('/artist', methods=['POST', 'GET'])
def artist():
    artist = request.args.get('artist')
    out = {}
    for a in mongo.db.art.find({"author": artist})[:10]:
        a.pop('_id')
        id = str(a.get('id'))
        out[id] = a
        out[id].pop('id')

    return out

@app.route('/get_advanced_results', methods=['GET'])
def get_advanced_results():

    author = request.args.get('author', '').lower()
    title = request.args.get('title', '').lower()
    form = request.args.get('form', '').lower()

    results = advanced_rank(author, title, bm25=False)
    if not form:
        return dict(enumerate(results))
    # print(results)
    out = dict.fromkeys(results[:5000])

    query = {'id': {'$in': results[:5000]}}

    query["form"]: form

    for a in mongo.db.art.find(query):
        a.pop('_id')
        out[a['id']] = a

    # return out
    return dict(enumerate(out))


if __name__ == '__main__':
    app.run(debug=True)
