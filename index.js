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

console.log(JSON.stringify(K));

function readSolution(dynArray, aItemSizes, mMaxIndex, lLastUsedItemSize, sDesiredSumm) {
    if (sDesiredSumm === 0) {
        return 0;
    }

    if (aItemSizes[mMaxIndex] >= sDesiredSumm) {
        return readSolution(dynArray, aItemSizes, mMaxIndex - 1, lLastUsedItemSize, sDesiredSumm);
    }

    if (mMaxIndex === 0 || dynArray[sDesiredSumm][mMaxIndex] === 0) {
        return false;
    }

    if (dynArray[sDesiredSumm-aItemSizes[mMaxIndex]] === 1 && lLastUsedItemSize !== aItemSizes[mMaxIndex]) {
        const result = readSolution(dynArray, aItemSizes, mMaxIndex - 1, aItemSizes[mMaxIndex], sDesiredSumm - aItemSizes[mMaxIndex]);
        if (result !== false) {
            return [...aItemSizes[mMaxIndex], ...result];
        }
    }

    if (dynArray[sDesiredSumm][mMaxIndex - 1] === 1) {
        const result = readSolution(dynArray, aItemSizes, mMaxIndex - 1, lLastUsedItemSize, sDesiredSumm);
        if (result !== false) {
            return [...aItemSizes[mMaxIndex], ...result];
        }
    }

    return false;
}