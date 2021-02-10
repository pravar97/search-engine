import re
from math import log10


def tokenize(text):
    return re.findall('[a-z0-9]+', text.lower())

def tfidf(n, index, q):
    # dictionary to return after getting filled
    sum = {}

    # Apply tokenisation, remove stop words and do stemming to query
    tokens = tokenize(q)
    rdocs = set()
    for t in tokens:  # O(t) where t is tokens in query
        if t in index:
            rdocs = rdocs.union(index[t][1])
    print(1)
    for d in rdocs:  # O(d) where d is total docs
        csum = 0.0
        for t in tokens:
            if t in index:
                if d in index[t][1]:
                    csum += (1 + log10(index[t][1][d])) * log10(n/index[t][0])

        sum[d] = round(csum, 4)
    print(2)
    # qnum is query number previously extracted, Sorting based on value
    sorted_sum = sorted(sum.items(), key=lambda x: x[1], reverse=True)
    print(sorted_sum[0])
    return sorted_sum
