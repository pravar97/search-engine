import json
from bson import json_util
from flask import Flask, render_template, request, jsonify
from flask_wtf import FlaskForm
from flask_bootstrap import Bootstrap
from flask_pymongo import PyMongo
from flask_cors import CORS
app = Flask(__name__)
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
    artist = mongo.db.artworks.find()
    alist = list(artist)[:10]
    out = {}
    for i, a in enumerate(alist*5):
        out[str(i)] = a
    print(out)
    return json.loads(json_util.dumps(out))
if __name__ == '__main__':
    app.run(debug=True)
