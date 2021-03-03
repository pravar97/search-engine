import json
import re
import pymongo
from nltk import corpus, download
from unidecode import unidecode
import string
import sys
import os


download('stopwords')
sw = set(corpus.stopwords.words('english'))


def makeTrigrams(tokens):
    trigrams = {}

    for token in tokens:
        chars = list(token)
        chars.insert(0, '<s>')
        chars.insert(0, '<s>')
        chars.append('</s>')
        chars.append('</s>')

        for c in range(0, len(chars)-2):
            trigrams[''.join(chars[c:c+3])] = trigrams.get(''.join(chars[c:c+3]), 0) + 1

    return trigrams


def tokenize(text):
    text = unidecode(text)
    text.replace('\'', "")
    text.replace('-', "")
    text = set(re.findall('[a-z0-9]+', text.lower()))
    return [t for t in text if t not in sw]


def main(field):
    myclient = pymongo.MongoClient("mongodb+srv://jacob:1mfeelingartsy@artdb-cluster.genfb.mongodb.net/artdb"
                                   "?retryWrites=true&w=majority")
    mydb = myclient["artdb"]

    docs = {}

    for a in mydb.art.find(projection={'id': True, field: True}):
        a.pop('_id')
        id = a.pop('id')
        docs[id] = {}

        for k, v in a.items():
            tokens = tokenize(str(v))
            trigrams = makeTrigrams(tokens)
            docs[id] = trigrams

    n = len(docs)
    if not os.path.exists('artist_index'):
        os.makedirs('artist_index')
    with open('artist_index/n.txt', 'w') as f:
        f.write(str(n))


if __name__ == '__main__':
    main()
