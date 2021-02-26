import json
import re
import pymongo
from nltk import corpus, download
from unidecode import unidecode
import string
import sys

download('stopwords')
sw = set(corpus.stopwords.words())


def tokenize(text):
    text = unidecode(text)
    text.replace('\'', "")
    text.replace('-', "")
    text = set(re.findall('[a-z0-9]+', text.lower()))
    return [t for t in text if t not in sw]


def makeIndex(docs):
    vocab = set()
    for d in docs:
        for num in docs[d]:
            for w in docs[d][num]:
                vocab.add(w)

    out = {}  # {term : {DOCNO*: tf, _df: df}}
    for t in vocab:

        out[t] = {'_df': 0}
    tdl = 0
    for d in docs:
        dl = 0
        for num in docs[d]:
            dl += len(docs[d][num])
            for w in docs[d][num]:
                if d in out[w]:
                    out[w][d][0] += num
                else:
                    out[w][d] = [num, dl]
                    out[w]['_df'] += 1
        tdl += dl
    return out, tdl


def main():
    myclient = pymongo.MongoClient("mongodb+srv://jacob:1mfeelingartsy@artdb-cluster.genfb.mongodb.net/artdb"
                                   "?retryWrites=true&w=majority")
    mydb = myclient["artdb"]

    docs = {}
    i=100
    total_docs = mydb.art.count()
    for a in mydb.art.find(projection={'id': True, 'text-data': True, 'description': True}):
        sys.stdout.write(f"\rRetrieving and processing Documents: {i//total_docs}%")
        a.pop('_id')
        id = a.pop('id')
        docs[id] = {}
        # Dict to map fields to weights
        field2weights = {'text-data': 4, 'description': 1}
        for k, v in a.items():
            tokens = tokenize(str(v))
            docs[id][field2weights[k]] = docs[id].get(field2weights[k], []) + tokens
        i+=100
    n = len(docs)
    with open('index/n.txt', 'w') as f:
        f.write(str(n))
    index, tdl = makeIndex(docs)
    with open('index/adl.txt', 'w') as f:
        f.write(str(tdl/n))
    files = {'000': {}}
    alphabet = list(string.ascii_lowercase)
    for a_1 in alphabet + ['']:
        for a_2 in alphabet + ['']:
            for a_3 in alphabet + ['']:
                files[a_1+a_2+a_3] = {}

    for i, v in index.items():
        begin = i[:3]
        if not begin.isalpha():
            begin = '000'

        files[begin].update({i: v})

    for key, v in files.items():
        if v:
            with open('index/'+key+'.json', 'w') as f:
                json.dump(v, f)


main()
