import json
import re
import pymongo


def tokenize(text):
    return re.findall('[a-z0-9]+', text.lower())

def makeIndex(docs):
    vocab = set()
    for d in docs:
        for num in docs[d]:
            for w in docs[d][num]:
                vocab.add(w)

    out = {}  # {term : [document frequency, {DOCNO: tf}]}
    for t in vocab:

        out[t] = {'_df': 0}

    for d in docs:
        for num in docs[d]:
            for w in docs[d][num]:
                if d in out[w]:
                    out[w][d] += 1/num
                else:
                    out[w][d] = 1/num
                    out[w]['_df'] += 1
    return out


def main():
    myclient = pymongo.MongoClient("mongodb+srv://jacob:1mfeelingartsy@artdb-cluster.genfb.mongodb.net/artdb"
                                   "?retryWrites=true&w=majority")
    mydb = myclient["artdb"]

    docs = {}
    for a in mydb.art.find():
        a.pop('_id')
        id = a.pop('id')
        docs[id] = {}

        for k, v in a.items():
            tokens = tokenize(str(v))
            docs[id][len(tokens)] = docs[id].get(len(tokens), []) + tokens

    with open('index/n.txt', 'w') as f:
        f.write(str(len(docs)))
    index = makeIndex(docs)
    for i, v in index.items():
        with open('index/'+i+'.json', 'w') as f:
            json.dump(v, f)


main()