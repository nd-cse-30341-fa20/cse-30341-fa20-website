#!/usr/bin/env python3

import csv
import random
import glob
import yaml

TAS      = [ta['gitlab'] for ta in yaml.safe_load(open('static/yaml/ta.yaml'))]
STUDENTS = []

for student in csv.DictReader(open('static/csv/students.csv', 'rU')):
    STUDENTS.append(student['Netid'])

random.shuffle(STUDENTS)
random.shuffle(TAS)

TAS      = TAS * (len(STUDENTS) // len(TAS) + 1)
MAPPING  = list(sorted(map(list, zip(STUDENTS, TAS))))

print(yaml.dump(MAPPING, default_flow_style=False))
