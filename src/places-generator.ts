const getRandomValueAndRemove = (array: any[]): any => {
    const index = Math.floor(Math.random() * array.length);
    const val = array[Math.floor(Math.random() * array.length)];
    const removedVal = array.splice(index, 1);

    return removedVal[0];
};

let mazeSize = 250;

let arr = new Array(mazeSize + mazeSize - 1);
arr = arr.fill(0).map(() => new Array(mazeSize + mazeSize - 1));

const center_i_j = mazeSize - 1;

const roomPlaces = [];
const centerCell = {
    row: center_i_j,
    column: center_i_j,
};
roomPlaces.push(centerCell);

while (mazeSize > 0) {
    const place = getRandomValueAndRemove(roomPlaces);

    arr[place.column][place.row] = 1;

    const top = arr[place.column][place.row - 1];
    const right = arr[place.column + 1][place.row];
    const bottom = arr[place.column][place.row + 1];
    const left = arr[place.column - 1][place.row];

    if (!top) {
        roomPlaces.push({
            row: place.row - 1,
            column: place.column
        });
    }

    if (!right) {
        roomPlaces.push({
            row: place.row,
            column: place.column + 1
        });
    }

    if (!bottom) {
        roomPlaces.push({
            row: place.row + 1,
            column: place.column
        });
    }

    if (!left) {
        roomPlaces.push({
            row: place.row,
            column: place.column - 1
        });
    }

    mazeSize--;
}

console.table(arr);