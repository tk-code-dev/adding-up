'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({input: rs, output: {}});
const prefectureDataMap = new Map();

rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const pref = columns[1];
    const popu_15_19 = parseInt(columns[3]);
    if (year === 2010 || year === 2015){ 
        let values = prefectureDataMap.get(pref);
        if (!values) {
            values = {
                popu2010: 0,
                popu2015: 0,
                rateOfChange: null
            };
        }
        if (year === 2010) {
            values.popu2010 = popu_15_19;
        }
        if (year === 2015) {
            values.popu2015 = popu_15_19;
        }
        prefectureDataMap.set(pref,values);
    }   
});

rl.on('close', () => {
    for (let [key, value] of prefectureDataMap) {
        value.rateOfChange = value.popu2015 / value.popu2010;
    }
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].rateOfChange - pair1[1].rateOfChange;
      });
    const rankingStrings = rankingArray.map(([key, value]) => {
        return `${key} :   ${value.popu2010} => ${value.popu2015}     Rate: ${value.rateOfChange.toFixed(3)}`;
    });
    console.log(rankingStrings);
});