import json
import re
import pymongo
from nltk import corpus, download
from unidecode import unidecode
import string
import sys
import os
from PyDictionary import PyDictionary
dictionary=PyDictionary()
download('stopwords')
download('wordnet')
sw = set(corpus.stopwords.words('english'))


def tokenize(text):
    text = unidecode(text)
    text.replace('\'', "")
    text.replace('-', "")
    text = set(re.findall('[a-z0-9]+', text.lower()))
    return [t for t in text if t not in sw]


def caption_to_tokens(caption_list):
    tokens = []
    for caption in caption_list:
        cap_tokens = tokenize(str(caption))
        for token in cap_tokens:
            if token not in tokens:
                tokens.append(token)
    return tokens


def isSynValid(w, vocab):
    if not tokenize(w):
        return False
    else:
        return tokenize(w)[0] in vocab


def makeIndex(docs):
    vocab = set()
    for d in docs:
        for num in docs[d]:
            for w in docs[d][num]:
                vocab.add(w)

    out = {}  # {term : {DOCNO*: tf, _df: df}}
    for t in vocab:
        out[t] = {'_df': 0}#, 'syns': [tokenize(w)[0] for w in dictionary.synonym(t) if isSynValid(w, vocab)]}
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
    for a in mydb.art.find(projection={'id': True, 'text_data': True, 'image_caption': True}):
        sys.stdout.write(f"\rRetrieving and processing Documents: {i//total_docs}%")
        a.pop('_id')
        id = a.pop('id')
        docs[id] = {}
        # Dict to map fields to weights
        field2weights = {'text_data': 4, 'description': 1, 'image_caption': 2, 'expansion': 0.5}
        for k, v in a.items():
            if k == 'image_caption':
                tokens = caption_to_tokens(v)
            else:
                tokens = tokenize(str(v))
            docs[id][field2weights[k]] = docs[id].get(field2weights[k], []) + tokens
            syns = set()
            for t in tokens:
                dict_syn = corpus.wordnet.synsets(t)
                if dict_syn is not None:
                    for s in dict_syn:
                        ts = tokenize(s.name())
                        if ts:
                            syns.add(ts[0])

            docs[id][field2weights['expansion']] = docs[id].get(field2weights['expansion'], []) + list(syns)
                    #list(set([y for y in (tokenize(z) for z in sum([], (x for x in (dictionary.synonym(t) for t in tokens))))]))
        i+=100
    n = len(docs)
    if not os.path.exists('index'):
        os.makedirs('index')
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
            if not os.path.exists('index_'+key[0]):
                os.makedirs('index_'+key[0])
            with open('index_'+key[0]+'/t_'+key+'.json', 'w') as f:
                json.dump(v, f)


if __name__ == '__main__':
    main()
