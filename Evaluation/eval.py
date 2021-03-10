from rank import rank
import numpy as np
import pandas as pd
from unidecode import unidecode
import re
from nltk import corpus, download
from itertools import permutations

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

    return results


def evaluate_metric_1():
    filename = ''
    df = pd.read_csv(filename, names=['ID', 'Title'])
    id_queries = {zip(df['ID'].tolist(), df['Title'].tolist())}
    ranks = []
    for key, query in id_queries.items():
        results = run_basic_query(query)
        ran = results.index(key)
        ranks.append(ran)
    print(f'Average Rank - {np.average(ranks)}')
    print(f'Rank StD - {np.std(ranks)}')
    print(f'Best Rank - {np.min(ranks)}')
    print(f'Worst Rank - {np.max(ranks)}')


def evaluate_metric_2():
    filename = ''
    df = pd.read_csv(filename, names=['ID', 'Title'])
    id_queries = {zip(df['ID'].tolist(), df['Title'].tolist())}
    ranks = {}
    for key, query in id_queries.items():
        query = tokenize(query)
        l = len(query)
        perms = []
        for i in range(l):
            perms.append(permutations(query, i))
        bestRank = 99999
        for perm in perms:
            results = run_basic_query(perm)
            ran = results.index(key)
            bestRank = min(bestRank, ran)

        ranks[key] = ranks.get(key, []) + [bestRank]


def main():
    pass


if __name__ == '__main__':
    main()
