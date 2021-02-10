import pickle
import re

import pymongo
from bson import ObjectId

def tokenize(text):
    return re.findall('[a-z0-9]+', text.lower())

def makeIndex(docs):
    vocab = set().union(*docs.values())
    out = {}  # {term : [document frequency, {DOCNO: tf}]}
    for t in vocab:

        out[t] = [0, {}]

    for d in docs:
        for w in docs[d]:
            if d in out[w][1]:
                out[w][1][d] += 1
            else:
                out[w][1][d] = 1
                out[w][0] += 1

    return len(docs), out

def main():
    myclient = pymongo.MongoClient("mongodb+srv://jacob:1mfeelingartsy@artdb-cluster.genfb.mongodb.net/artdb"
                                   "?retryWrites=true&w=majority")
    mydb = myclient["artdb"]

    dblist = myclient.list_database_names()

    artworks = mydb.art.find()
    alist = list(artworks)
    docs = {}
    for a in alist:
        id = str(a.pop('_id'))
        docs[id] = ''
        for v in a.values():
            docs[id] += ' ' + str(v)
        docs[id] = tokenize(docs[id])
        # out[str(i)] = a
    print(docs)

    index = makeIndex(docs)
    print(index)
    with open('index.pkl', 'wb') as f:
        pickle.dump(index, f)


main()