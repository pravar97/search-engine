import json
import re
import pymongo
from nltk.corpus import stopwords
from unidecode import unidecode
import string
import sys
sw = set(stopwords.words('english'))


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

    for d in docs:
        for num in docs[d]:
            for w in docs[d][num]:
                if d in out[w]:
                    out[w][d] += num
                else:
                    out[w][d] = num
                    out[w]['_df'] += 1
    return out


def main():
    myclient = pymongo.MongoClient("mongodb+srv://jacob:1mfeelingartsy@artdb-cluster.genfb.mongodb.net/artdb"
                                   "?retryWrites=true&w=majority")
    mydb = myclient["artdb"]

    docs = {}
    print('1')
    i=0
    for a in mydb.art.find(projection={'id': True, 'text-data': True, 'description': True}):
        sys.stdout.write(f"\rChecking row - {i}")
        a.pop('_id')
        id = a.pop('id')
        docs[id] = {}
        # Dict to map fields to weights
        field2weights = {'text-data': 2, 'description': 1}
        for k, v in a.items():
            tokens = tokenize(str(v))
            docs[id][field2weights[k]] = docs[id].get(field2weights[k], []) + tokens
        i+=1

    print('2')
    with open('index/n.txt', 'w') as f:
        f.write(str(len(docs)))
    index = makeIndex(docs)
    files = {'00': {}}
    alphabet = list(string.ascii_lowercase)
    for a_1 in alphabet + ['']:
        for a_2 in alphabet + ['']:
            files[a_1+a_2] = {}
    print(files)
    print('3')
    for i, v in index.items():
        begin = i[:2]
        if not begin.isalpha():
            begin = '00'

        files[begin].update({i: v})

    print('4')
    for key, v in files.items():
        with open('index/'+key+'.json', 'w') as f:
            json.dump(v, f)


main()
