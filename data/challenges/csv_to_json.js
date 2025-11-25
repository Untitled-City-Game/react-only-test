import csv2json from 'csvjson-csv2json';
import fs from 'fs';

const csv = fs.readFileSync(`./data/challenges/challenges_${process.argv[2]}.csv`).toString();
const json = csv2json(csv, {parseNumbers: true});
fs.writeFileSync(`./data/challenges/challenges_${process.argv[2]}.json`, JSON.stringify(json));