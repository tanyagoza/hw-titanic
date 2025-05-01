import fs from 'fs';

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



fs.readFile('./train.csv', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const arr = data.split('\n');
    arr.shift();
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
    for (let i = 0; i < arr.length; i++) {
        const cells = csvToArray(arr[i]);
        let currentFare =  +cells[9]
        let currentClass = +cells[2]
        let survived = +cells[1]
        let sex = cells[4]
        let age = +cells[5]

        if (sex === 'male' && (age >= 18 || age === 0)){
            if (survived === 0){
                maleNSurCount++;
            }else {
                maleSurCount++;
            }

        }
        if (sex === 'female' && (age >= 18 || age === 0)) {
            if (survived === 0){
                femaleNSurCount++;
            }else {
                femaleSurCount++;
            }
        }
        if (age < 18 && age !== 0){
            if (survived === 0){
                childrenNSurCount++;
            }else {
                childrenSurCount++;
            }
        }

        if (survived === 0){
            nonSurvivedCount++;
        }else {
            survivedCount++;
        }

        if (currentClass === 1) {
            fare1 += currentFare;
            firstClassCount++;
        }
        if (currentFare) {
            fare += currentFare;
        }
    }
    console.log("total fare: " + fare);
    console.log("total fare for class 1: " + fare1);
    console.log("average fare for class 1: " + fare1/firstClassCount);
    console.log('count of survived: ' + survivedCount);
    console.log('count of non-survived: ' + nonSurvivedCount);

    console.log('count of survived male: ' + maleSurCount);
    console.log('count of non-survived male: ' + maleNSurCount);

    console.log('count of survived female: ' + femaleSurCount);
    console.log('count of non-survived female: ' + femaleNSurCount);

    console.log('count of survived children: ' + childrenSurCount);
    console.log('count of non-survived children: ' + childrenNSurCount);



})