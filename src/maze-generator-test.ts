import { NewDungeon } from './maze-generator';

// with options
const options = {
    width: 50,
    height: 50,
    minRoomSize: 5,
    maxRoomSize: 20
};
const dungeon = NewDungeon(options);

console.table(dungeon);
