import {Node, Point} from "../typings";
const NavigationData = require("../../navData/data.json");


class MapUtils {
    getFloorId(roomId: number) {
        //Rooms from 0-99 are in the first floor, 100-199 in the second etc.
        return Math.floor(roomId / 100);
    }

    getPathLength(node1: Node, node2: Node) {
        return Math.sqrt(Math.pow(node1.location.x - node2.location.x, 2) + Math.pow(node1.location.y - node2.location.y, 2));
    }

    getFloorCenter(floorId: number): Point {
        //TODO Remove when navdata is complete
        if(!NavigationData.floors[floorId])
            return {x: 0, y: 0};

        //Return center of floor
        return NavigationData.floors[floorId].center;
    }
}

//Export initialized navigator
export default new MapUtils();