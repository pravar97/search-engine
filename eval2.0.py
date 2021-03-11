from rank import rank
import numpy as np
import pandas as pd
from unidecode import unidecode
import re
from nltk import corpus, download
from itertools import permutations
from collections import OrderedDict
import random

download('stopwords')
sw = set(corpus.stopwords.words('english'))


def tokenize(text):
    text = unidecode(text)
    text.replace('\'', "")
    text.replace('-', "")
    text = set(re.findall('[a-z0-9]+', text.lower()))
    return [t for t in text if t not in sw]


def run_basic_query(query):
    if query is None:
        results = []
    else:
        results = rank(query, False)

    return dict(enumerate(results))


def evaluate_metric_1():
    filename = 'C:\\Users\\Jacob\\source\\repos\\TTDS-Art-Search\\Evaluation\\famous-titles.txt'
    df = pd.read_csv(filename, names=['ID', 'Title'], sep='\t')
    ranks = []
    top8 = 0
    total = 0
    for key, query in zip(df['ID'].tolist(), df['Title'].tolist()):
        print(f'{key} - {query}')
        if key is not '-':
            results = rank(query, False)
            ran = results.index(key)
            ranks.append(ran)
            if ran < 8:
                top8 += 1
            total += 1
    print(f'Average Rank - {np.average(ranks)}')
    print(f'Rank StD - {np.std(ranks)}')
    print(f'Best Rank - {np.min(ranks)}')
    print(f'Worst Rank - {np.max(ranks)}')
    print(f'% in top 8 - {top8 / total}')


def evaluate_metric_2():
    filename = 'Evaluation/queries-individual.txt'
    df = pd.read_csv(filename, names=['ID', 'Title'], sep='\t')
    ranks = {}
    top40 = 0
    total = 0
    for key, query in zip(df['ID'].tolist(), df['Title'].tolist()):
        query = tokenize(query)
        l = len(query)
        perms = []
        for i in range(1, 5):
            ret = list(permutations(query, i))
            for j in ret:
                perms.append(list(j))
        bestRank = 99999

        perms = [query]
        for perm in perms:
            perm_str = ' '.join(perm)
            results = rank(perm_str)
            try:
                ran = results.index(str(key))
            except:
                ran = 99999
            bestRank = min(bestRank, ran)

        ranks[key] = ranks.get(key, []) + [bestRank]
        if bestRank < 40:
            top40 += 1
        total += 1
        print(bestRank)
    print(top40/total)


def main():
    evaluate_metric_2()


if __name__ == '__main__':
    main()
