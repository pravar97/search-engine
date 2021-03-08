import re
from math import log10
import json
from unidecode import unidecode


def tokenize(text):
    text = unidecode(text)
    text.replace('\'', "")
    text.replace('-', "")
    return re.findall('[a-z0-9]+', text.lower())


def rank(q, bm25=False):
    # dictionary to return after getting filled
    sum = {}
    tokens = tokenize(q)
    rdocs = set()
    with open('index/n.txt', 'r') as f:
        n = int(f.read())

    index = {}

    for t in tokens:  # O(t) where t is tokens in query
        try:
            begin = t[:3]
            if not begin.isalpha():
                begin = '000'
            with open('index_'+begin[0]+'/t_' + begin + '.json') as f:

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
                    tf, df = index[t][d][0], index[t]['_df']
                    if bm25:
                        k = 1.5  # Parameters that can be tweaked (and line below)
                        b = 0
                        dl = index[t][d][1]
                        with open('index/adl.txt', 'r') as f:
                            adl = float(f.read())
                        csum += ((tf * (k+1))/(tf + k*(1 - b + b * dl / adl))) * (log10((n - df + 0.5)/(df + 0.5)))

                    else:
                        csum += (1 + log10(tf)) * log10(n / df)

        sum[d] = round(csum, 4)

    sorted_sum = sorted(sum, key=sum.get, reverse=True)

    return sorted_sum


def field_rank(field, q, bm25=False):
    # dictionary to return after getting filled
    sum = {}
    tokens = tokenize(q)
    rdocs = set()
    with open(f'{field}_index/n.txt', 'r') as f:
        n = int(f.read())

    index = {}

    for t in tokens:  # O(t) where t is tokens in query
        try:
            begin = t[:2]
            if not begin.isalpha():
                begin = '00'
            with open(f'{field}_index/t_' + begin + '.json') as f:

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
                    tf, df = index[t][d][0], index[t]['_df']
                    if bm25:
                        k = 1.5
                        b = 0
                        dl = index[t][d][1]
                        with open(f'{field}_index/adl.txt', 'r') as f:
                            adl = float(f.read())
                        csum += ((tf * (k+1))/(tf + k*(1 - b + b * dl / adl))) * (log10((n - df + 0.5)/(df + 0.5)))

                    else:
                        csum += (1 + log10(tf)) * log10(n / df)

        sum[d] = round(csum, 4)

    # sorted_sum = sorted(sum, key=sum.get, reverse=True)

    return sum


def advanced_rank(author, title, bm25=False):
    fr = None
    if author:
        fr_author = field_rank('author', author, bm25)
    if title:
        fr_title = field_rank('title', title, bm25)

    if author and title:
        # fr = {}
        fr = fr_author
        for key, amount in fr_title.items():
            fr[key] = fr_author.get(key, 0) + amount
            # if key in fr_author:
            #     fr[key] = fr_author.get(key) * amount
    elif author:
        fr = fr_author
    elif title:
        fr = fr_title
    else:
        return None

    return sorted(fr, key=fr.get, reverse=True)
