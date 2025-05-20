import re
import pymongo
from nltk import corpus, download
from unidecode import unidecode
import os
import json
import string


download('stopwords')
sw = set(corpus.stopwords.words('english'))


def tokenize(text):
    text = unidecode(text)
    text.replace('\'', "")
    text.replace('-', "")
    return re.findall('[a-z0-9]+', text.lower())
    # return [t for t in text if t not in sw]


def makeIndex(docs):
    vocab = set()
    for d in docs:
        for w in docs[d]:
            vocab.add(w)

    out = {}  # {term : {DOCNO*: tf, _df: df}}
    for t in vocab:

        out[t] = {'_df': 0}
    tdl = 0
    for d in docs:
        dl = 0
        for w in docs[d]:
            dl += len(w)
            if d in out[w]:
                out[w][d][0] += 1
            else:
                out[w][d] = [1, dl]
                out[w]['_df'] += 1
        tdl += dl
    return out, tdl


def main(field):
    
    username = os.getenv("MONGO_USERNAME")
    password = os.getenv("MONGO_PASSWORD")
    connection_string = f"mongodb+srv://{username}:{password}@artdb-cluster.genfb.mongodb.net/artdb?retryWrites=true&w=majority"
    
    myclient = pymongo.MongoClient(connection_string)
    mydb = myclient["artdb"]

    docs = {}

    for a in mydb.art.find(projection={'id': True, field: True}):
        a.pop('_id')
        id = a.pop('id')
        docs[id] = {}  # {id: }
        v = a.get(field)
        tokens = tokenize(str(v))

        docs[id] = tokens

    n = len(docs)
    if not os.path.exists(f'{field}_index'):
        os.makedirs(f'{field}_index')
    with open(f'{field}_index/n.txt', 'w') as f:
        f.write(str(n))

    index, tdl = makeIndex(docs)
    with open(f'{field}_index/adl.txt', 'w') as f:
        f.write(str(tdl / n))

    files = {'00': {}}
    alphabet = list(string.ascii_lowercase)

    for a_1 in alphabet + ['']:
        for a_2 in alphabet + ['']:
            files[a_1+a_2] = {}

    for i, v in index.items():
        begin = i[:2]
        if not begin.isalpha():
            begin = '00'

        files[begin].update({i: v})
    if not os.path.exists(f'{field}_index/'):
        os.makedirs(f'{field}_index/')
    for key, v in files.items():
        if v:
            with open(f'{field}_index/t_'+key+'.json', 'w') as f:
                json.dump(v, f)


if __name__ == '__main__':
    for field in ['author', 'title']:
        main(field)
