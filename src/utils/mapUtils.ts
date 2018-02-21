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

    isCorner(node1: Node, node2: Node, node3: Node) {
    	if(!node1 || !node2 || !node3)
    		return false;

    	return Math.abs(this.getPitch(node1.location, node2.location) - this.getPitch(node2.location, node3.location)) > 10;
	}

	getPitch(p1: Point, p2: Point) {
		//Calculated the pitch between the two points and return it (|delta y| / |delta x|)
		return Math.abs(p1.y - p2.y) / Math.abs(p1.x - p2.x);
	}
}

//Export initialized navigator
export default new MapUtils();