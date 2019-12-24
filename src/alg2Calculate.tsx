interface Bin {
    itemsArray: Item[];
    length: number;
    id: string;
}

interface Item {
    id: string;
    count: number;
}

function failFastChecks(Bins: Bin[], slack: number, mapSumItems: any) {
    return false;
}

function removeSubset<T>(arr: T[], subset: T[], fn: (val: T, val2: T) => boolean) {
    const exclude = [...subset];
    return arr.filter(x => {
        const idx = exclude.findIndex((val: T) => {
            return fn(val, x)
        });
        if (idx >= 0) {
            exclude.splice(idx, 1);
            return false;
        }
        return true;
    });
}

function generateAllSubsquences<T>(arr: T[]): T[][]  {
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

function generateSumSetsMap<T>(allSubSeq: T[][], fn: (val: T) => number): Map<number, T[][]> {
    const map = new Map();
    allSubSeq.forEach((arr) => {
        const summ = arr.reduce((a: number, b) => a + fn(b), 0);
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

function attemptAssign(Bins: Bin[], Items: Item[], slack: number): Bin[] {
    if (Bins.length === 0) {
        return [];
    }
    const allSubsequences = generateAllSubsquences(Items);
    const mapSumItems = generateSumSetsMap(allSubsequences, (val: Item) => val.count);
    if (failFastChecks(Bins, slack, mapSumItems)) {
        return null;
    }
    let surplus = 0;
    while (surplus < Bins[0].length && surplus <= slack) {
        const summing = Bins[0].length - surplus;
        if (mapSumItems.has(summing)) {
            const allSets = mapSumItems.get(summing);
            for (let i = 0; i < allSets.length; i++) {
                const solution: Bin[] = attemptAssign(removeSubset(Bins, [Bins[0]], (val1: Bin, val2: Bin) => {
                        return val1.id === val2.id
                    }),
                    removeSubset(Items, allSets[i], (val1: Item, val2: Item) => {
                        return val1.id === val2.id
                    }),
                    slack - surplus);
                if (solution) {
                    Bins[0].itemsArray = allSets[i];

                    return [...solution, Bins[0]];
                }
            }
        }
        surplus = surplus + 1;
    }

    return null;
}

function alg2Calculate(Bins: Bin[], Items: Item[], minIgnored?: number) {
    const itemSum = Items.reduce((a, b) => a + b.count, 0);

    const sizes: number[] = Bins.reduce((acc: number[], bin: Bin) => {
        acc.push(bin.length);
        return acc;
    }, []);

    const maxSize = Math.max(...sizes);

    const maxSpill = minIgnored ? Math.max(0, maxSize - minIgnored) : maxSize;

    const allSubsquences: Item[][] = generateAllSubsquences(Items);
    const sumMap: Map<number, Item[][]> = generateSumSetsMap(allSubsquences, (val: Item) => val.count);

    const allBinsSubsquences = generateAllSubsquences(Bins);
    const sumBinsMap: Map<number, Bin[][]> = generateSumSetsMap(allBinsSubsquences, (val: Bin) => val.length);

    for (let waste = 0; waste <= maxSize; waste++) {
        for (let spill = 0; spill <= maxSpill; spill++) {
            const obtaining = waste + itemSum - spill;

            if (sumBinsMap.has(obtaining) && sumMap.has(spill)) {
                const binSets = sumBinsMap.get(obtaining);
                for (let i = 0; i < binSets.length; i++) {
                    const binSet = binSets[i];
                    const tempSet = removeSubset(Bins, binSet, (val1: Bin, val2: Bin) => {
                        return val1.id === val2.id
                    });
                    const tempSetValues = tempSet.reduce((acc, val) => {
                        acc.push(val.length);
                        return acc
                    }, []);

                    const maxTempSize = Math.max(...tempSetValues);

                    if (maxTempSize - spill > minIgnored) {
                        continue;
                    }
                    const itemSets = sumMap.get(itemSum - spill);
                    for (let j = 0; j < itemSets.length; j++) {
                        const itemSet = itemSets[j];
                        const solution: Bin[] = attemptAssign(binSet, itemSet, waste);

                        if (solution) {
                            const lastSet = removeSubset(Items, itemSet, (val1: Item, val2: Item) => { return val1.id === val2.id});
                            const currentBins = solution; //.reduce((acc, val) => acc.concat(val[0]), []);

                            const lastSumm = lastSet.reduce((acc: number, val: Item) => acc + val.count, 0);

                            const unusedBins = removeSubset(Bins, currentBins, (val1: Bin, val2: Bin) => { return val1.id === val2.id});
                            const unusedBin = unusedBins[0];

                            if (unusedBin) {
                                if (unusedBin.length >= lastSumm) {
                                    unusedBin.itemsArray = lastSet;
                                    solution.push(unusedBin);
                                } else {
                                    continue;
                                }
                            } else {
                                const lastSummx = solution[solution.length - 1].itemsArray.reduce((acc, val: Item) => acc + val.count, 0);
                                if (solution[solution.length - 1].length - (lastSummx + lastSumm) > 0) {
                                    solution[solution.length - 1].itemsArray.push(...lastSet);
                                } else {
                                    throw new Error('No enough space');
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

export { alg2Calculate };