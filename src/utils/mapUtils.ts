import {ClassRoom, Point} from "../typings";
const NavigationData = require("../../navData/data.json");


class MapUtils {
    getFloorId(roomId: number) {
        //Rooms from 0-99 are in the first floor, 100-199 in the second etc.
        return Math.floor(roomId / 100);
    }

    getPathLength(room1: ClassRoom, room2: ClassRoom) {
        return Math.sqrt(Math.pow(room1.location.x - room2.location.x, 2) + Math.pow(room2.location.y - room1.location.y, 2));
    }
}

//Export initialized navigator
export default new MapUtils();