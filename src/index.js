const { alg2Calculate } = require('../dist/alg2Calculate');
// START BACKPACK

// # | Item | Weight | Value |
// # |------|--------|-------|
// # | 1    | 2      | 1     |
// # | 2    | 10     | 20    |
// # | 3    | 3      | 3     |
// # | 4    | 6      | 14    |
// # | 5    | 18     | 100   |

// # Put a placeholder 0 weight, 0 value item to max
// # these line up better with the 1D memoization table K
const item_weights = [0, 2, 10, 3, 6, 18];
const item_values = [0, 1, 20, 3, 14, 100];

const n = item_weights.length;
const W = 15; // # total weight capacity
const K = [];

for (let i = 0; i < n; i++) {
    const arr = new Array(16);
    arr.fill(0);
    K.push(arr);
}

// # Recurrence
for (let i = 1; i < n; i++) {
    for (let w = 1; w <= W; w++) {
        const wi = item_weights[i];
        const vi = item_values[i];

        if (wi <= w) {
            K[i][w] = Math.max(K[i - 1][w - wi] + vi, K[i - 1][w]);
        } else {
            K[i][w] = K[i - 1][w]
        }
    }
}

//console.log(JSON.stringify(K));

// END BACKPACK

// START Algorithm1
function readSolution(dynArray, aItemSizes, mMaxIndex, lLastUsedItemSize, sDesiredSumm) {
    if (sDesiredSumm === 0) {
        return [];
    }

    // >= -> > - is it critical?
    if (aItemSizes[mMaxIndex] > sDesiredSumm) {
        return readSolution(dynArray, aItemSizes, mMaxIndex - 1, lLastUsedItemSize, sDesiredSumm);
    }

    if (mMaxIndex === -1 || dynArray[sDesiredSumm][mMaxIndex] === 0) {
        return false;
    }

    if (dynArray[sDesiredSumm - aItemSizes[mMaxIndex]][mMaxIndex] === 1 && lLastUsedItemSize !== aItemSizes[mMaxIndex]) {
        const result = readSolution(dynArray, aItemSizes, mMaxIndex - 1, aItemSizes[mMaxIndex], sDesiredSumm - aItemSizes[mMaxIndex]);
        if (result !== false) {
            return [aItemSizes[mMaxIndex], ...result];
        }
    }

    if (dynArray[sDesiredSumm][mMaxIndex] === 1) {
        const result = readSolution(dynArray, aItemSizes, mMaxIndex - 1, lLastUsedItemSize, sDesiredSumm);
        if (result !== false) {
            return result;
        }
    }

    return false;
}

// END ALGORITHM 1

function create2DArray(rows, columns) {
    let arr = new Array(rows);

    for (let i = 0; i < rows; i++) {
        arr[i] = new Array(columns);
    }

    return arr;
}

// Returns true if there is a subset
// of set[] with sun equal to given sum
function generateSubset(set, n, sum) {
    // The value of subset[i][j] will be true if there
    // is a subset of set[0..j-1] with sum equal to i
    const subset = create2DArray(sum + 1, n + 1);

    // If sum is 0, then answer is true
    for (let i = 0; i <= n; i++) {
        subset[0][i] = 1;
    }

    // If sum is not 0 and set is empty, then answer is false
    for (let i = 1; i <= sum; i++) {
        subset[i][0] = 0;
    }

    // Fill the subset table in bottom up manner
    for (let i = 1; i <= sum; i++) {
        for (let j = 1; j <= n; j++) {
            subset[i][j] = subset[i][j - 1];
            if (i >= set[j - 1]) {
                subset[i][j] = subset[i][j] ||
                    subset[i - set[j - 1]][j - 1];
            }
        }
    }

    subset.forEach((val) => val.splice(0, 1));

    // return subset[sum][n];
    return subset;
}

let set = [2, 3, 4, 12, 34].sort((a, b) => a - b);
let sum = 6;
let z = set.length;

const dArray = generateSubset(set, z, sum);

// console.table(dArray);

/*
 readSolution(dptsum,i,a1 ...an,m,l,s)
 The next solution can be obtained by blocking the use of the item ai with the lowest i in the previous solution,
 and unblocking all aj for j < i
*/
const res = readSolution(dArray, set, set.length - 1, 0, sum);

// console.log('Set: ', set);
// console.log('Ask: ', sum);
// console.log('Answer: ', res);

//


// const dArraySumOfBins = generateSubset(bins, bins.length - 1, bins.reduce((a, b) => a + b, 0));
// const dArraySumOfItemSizes = generateSubset(itemSizes, itemSizes.length - 1, itemSizes.reduce((a, b) => a + b, 0));


const bins = [{
    itemsArray: [],
    length: 10,
    id: 'B1',
}, {
    itemsArray: [],
    length: 100,
    id: 'B2',
}, {
    itemsArray: [],
    length: 1000,
    id: 'B3',
}].sort((a, b) => b.length - a.length);
const itemSizes = [{
    count: 60,
    id: 'I1',
}, {
    count: 500,
    id: 'I2',
}, {
    count: 400,
    id: 'I3',
}, {
    count: 95,
    id: 'I4',
},
    {
        count: 10,
        id: 'I6',
    }].sort((a, b) => b.count - a.count);

const minIgnored = 50; // can be null

console.log('Bins: ', bins);
console.log('Items: ', itemSizes);
console.log('MinIgnored: ', minIgnored);


const res1 = alg2Calculate(bins, itemSizes, minIgnored);
console.log(res1);
console.log(JSON.stringify(res1));
