import fs from 'fs';
import readline from 'readline';

function csvToArray(text) {
    let ret = [''], i = 0, p = '', s = true;
    for (let l in text) {
        l = text[l];
        if ('"' === l) {
            s = !s;
            if ('"' === p) {
                ret[i] += '"';
                l = '-';
            } else if ('' === p)
                l = '-';
        } else if (s && ',' === l)
            l = ret[++i] = '';
        else
            ret[i] += l;
        p = l;
    }
    return ret;
}

const fileStream = fs.createReadStream('./train.csv', 'utf-8');

const reader = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
})

let fare = 0;
let fare1 = 0;
let firstClassCount = 0;
let survivedCount = 0;
let nonSurvivedCount = 0;
let maleSurCount = 0;
let femaleSurCount = 0;
let childrenSurCount = 0;

let maleNSurCount = 0;
let femaleNSurCount = 0;
let childrenNSurCount = 0;
let isFirstLine = true;

reader.on('line', (line) => {
    if(isFirstLine){
        isFirstLine = false;
        return;
    }

    const cells = csvToArray(line);

    const currentFare = +cells[9];
    const currentClass = +cells[2];
    const survived = +cells[1];
    const sex = cells[4];
    const age = +cells[5];

    if (sex === 'male' && (age >= 18 || age === 0)) {
        if (survived === 0) maleNSurCount++;
        else maleSurCount++;
    }

    if (sex === 'female' && (age >= 18 || age === 0)) {
        if (survived === 0) femaleNSurCount++;
        else femaleSurCount++;
    }

    if (age < 18 && age !== 0) {
        if (survived === 0) childrenNSurCount++;
        else childrenSurCount++;
    }

    if (survived === 0) nonSurvivedCount++;
    else survivedCount++;

    if (currentClass === 1) {
        fare1 += currentFare;
        firstClassCount++;
    }

    if (!isNaN(currentFare)) {
        fare += currentFare;
    }
});

reader.on('close', () => {
    console.log("total fare: " + fare.toFixed(2));
    console.log("total fare for class 1: " + fare1.toFixed(2));
    console.log("average fare for class 1: " + (fare1 / firstClassCount).toFixed(2));

    console.log('count of survived: ' + survivedCount);
    console.log('count of non-survived: ' + nonSurvivedCount);

    console.log('count of survived male: ' + maleSurCount);
    console.log('count of non-survived male: ' + maleNSurCount);

    console.log('count of survived female: ' + femaleSurCount);
    console.log('count of non-survived female: ' + femaleNSurCount);

    console.log('count of survived children: ' + childrenSurCount);
    console.log('count of non-survived children: ' + childrenNSurCount);
});