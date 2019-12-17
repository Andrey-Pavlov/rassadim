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
function generateAllSubsquences(arr) {
    const n = arr.length;
    /* Number of subsequences is (2**n -1)*/
    const opsize = Math.pow(2, n);
    const dArray = [];

    /* Run from counter 000..1 to 111..1*/
    for (let counter = 1; counter < opsize; counter++) {
        const tempArray = [];

        for (let j = 0; j < n; j++) {
            /* Check if jth bit in the counter is set
                If set then print jth element from arr[] */

            if (counter & (1 << j)) {
                tempArray.push(arr[j]);
            }
        }
        dArray.push(tempArray);
    }

    return dArray;
}

function generateSumSetsMap(allSubSeq) {
    const map = new Map();
    allSubSeq.forEach((arr) => {
        const summ = arr.reduce((a, b) => a + b, 0);
        if (map.has(summ)) {
            const x = map.get(summ);
            x.push(arr);

            map.set(summ, x);
        } else {
            map.set(summ, [arr]);
        }
    });

    return map;
}

// const dArraySumOfBins = generateSubset(bins, bins.length - 1, bins.reduce((a, b) => a + b, 0));
// const dArraySumOfItemSizes = generateSubset(itemSizes, itemSizes.length - 1, itemSizes.reduce((a, b) => a + b, 0));
function failFastChecks(Bins, slack, mapSumItems) {
    return false;
}

function removeSubset(arr, subset) {
    const exclude = [...subset];
    return arr.filter(x => {
        const idx = exclude.indexOf(x);
        if (idx >= 0) {
            exclude.splice(idx, 1);
            return false;
        }
        return true;
    });
}

function attemptAssign(Bins, Items, slack) {
    if (Bins.length === 0) {
        return [];
    }
    const allSubsequences = generateAllSubsquences(Items);
    const mapSumItems = generateSumSetsMap(allSubsequences);
    if (failFastChecks(Bins, slack, mapSumItems)) {
        return null;
    }
    let surplus = 0;
    while (surplus < Bins[0] && surplus <= slack) {
        const summing = Bins[0] - surplus;
        if (mapSumItems.has(summing)) {
            const allSets = mapSumItems.get(summing);
            for (let i = 0; i < allSets.length; i++) {
                const solution = attemptAssign(removeSubset(Bins, [Bins[0]]), removeSubset(Items, allSets[i]), slack - surplus);
                if (solution) {
                    return [...solution, [[Bins[0]], allSets[i]]];
                }
            }
        }
        surplus = surplus + 1;
    }

    return null;
}

const bins = [10, 10, 11, 10].sort((a, b) => b - a);
const itemSizes = [10, 9, 10, 10].sort((a, b) => b - a);
const minIgnored = 2;

console.log('Bins: ', bins);
console.log('Items: ', itemSizes);
console.log('MinIgnored: ', minIgnored);

function alg2Calculate(Bins, Items, minIgnored) {
    const itemSum = Items.reduce((a, b) => a + b, 0);
    const maxSpill = Math.max(0, Math.max(...Bins) - minIgnored);

    const allSubsquences = generateAllSubsquences(Items);
    const sumMap = generateSumSetsMap(allSubsquences);

    const allBinsSubsquences = generateAllSubsquences(Bins);
    const sumBinsMap = generateSumSetsMap(allBinsSubsquences);

    for (let waste = 0; waste <= Math.max(...Bins); waste++) {
        for (let spill = 0; spill <= maxSpill; spill++) {
            const obtaining = waste + itemSum - spill;

            if (sumBinsMap.has(obtaining) && sumMap.has(spill)) {
                const binSets = sumBinsMap.get(obtaining);
                for (let i = 0; i < binSets.length; i++) {
                    const binSet = binSets[i];
                    const tempSet = removeSubset(Bins, binSet);
                    if (Math.max(...tempSet) - spill > minIgnored) {
                        continue;
                    }
                    const itemSets = sumMap.get(itemSum - spill);
                    for (let j = 0; j < itemSets.length; j++) {
                        const itemSet = itemSets[j];
                        const solution = attemptAssign(binSet, itemSet, waste);

                        if (solution) {
                            const lastSet = removeSubset(Items, itemSet);
                            const currentBins = solution.reduce((acc, val) => acc.concat(val[0]), []);
                            const unusedBins = removeSubset(Bins, currentBins);
                            const unusedBin = unusedBins[0];
                            const lastSumm = lastSet.reduce((acc, val) => acc + val);
                            if (unusedBin) {
                                if (unusedBin >= lastSumm) {
                                    solution.push([[unusedBin], lastSet]);
                                } else {
                                    throw new Error('Incorrect bin');
                                }
                            } else {
                                const lastSummx = solution[solution.length-1][1].reduce((acc, val) => acc + val);
                                if (solution[solution.length-1][0] - (lastSummx + lastSumm) > 0) {
                                    solution[solution.length-1][1].push(...lastSet);
                                } else {
                                    throw new Error('No enought space');
                                }
                            }

                            return solution;
                        }
                    }
                }
            }
        }
    }
}

const res1 = alg2Calculate(bins, itemSizes, minIgnored);
console.log(res1);
