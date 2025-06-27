import csv2json from 'csvjson-csv2json';
import fs from 'fs';

const csv = fs.readFileSync('./data/challenges/challenges_melbourne.csv').toString()
;
const json = csv2json(csv, {parseNumbers: true});
fs.writeFileSync('./data/challenges/challenges_melbourne.json', JSON.stringify(json));