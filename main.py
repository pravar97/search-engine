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
    artist = mongo.db.artists.find_one({"birth_year": 1552})
    print(artist)
    return json.loads(json_util.dumps(artist))


if __name__ == '__main__':
    app.run(debug=True)

'''
(venv) p@p:~/Documents/ttds/TTDS-Art-Search/art_se$ npm start

> client@0.1.0 start /home/p/Documents/ttds/TTDS-Art-Search/art_se
> react-app-rewired start

sh: 1: react-app-rewired: Permission denied
npm ERR! code ELIFECYCLE
npm ERR! errno 126
npm ERR! client@0.1.0 start: `react-app-rewired start`
npm ERR! Exit status 126
npm ERR! 
npm ERR! Failed at the client@0.1.0 start script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/p/.npm/_logs/2021-01-19T16_37_03_783Z-debug.log

'''