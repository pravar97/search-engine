import re
from math import log10
import json
from unidecode import unidecode


def tokenize(text):
    text = unidecode(text)
    text.replace('\'', "")
    text.replace('-', "")
    return re.findall('[a-z0-9]+', text.lower())


def tfidf(q):
    # dictionary to return after getting filled
    sum = {}
    tokens = tokenize(q)
    rdocs = set()
    with open('index/n.txt', 'r') as f:
        n = int(f.read())
    index = {}

    for t in tokens:  # O(t) where t is tokens in query
        try:
            begin = t[:2]
            if not begin.isalpha():
                begin = '00'
            with open('index/' + begin + '.json') as f:

                j = json.load(f)[t]
                index[t] = j.copy()
                j.pop('_df')
                rdocs = rdocs.union(j)

        except:
            pass

    for d in rdocs:  # O(d) where d is total docs
        csum = 0.0
        for t in tokens:
            if t in index:
                if d in index[t]:

                    csum += (1 + log10(index[t][d])) * log10(n/index[t]['_df'])
        sum[d] = round(csum, 4)

    sorted_sum = sorted(sum, key=sum.get, reverse=True)
    return sorted_sum
