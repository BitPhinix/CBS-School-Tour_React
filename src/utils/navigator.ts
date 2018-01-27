import {ClassRoom, Floor} from "../typings";
const NavigationData = require("../../navData/data.json");

interface NavigationMap {
    [roomId: number]: {predecessorId: string, distance: number, processed: boolean}
}

class Navigator {

    //Big thanks to https://www.youtube.com/watch?v=GazC3A4OQTE&t=278s
    navigateFloor(startId: number, destinationId: number, floorId: number) {
        const navigationMap: NavigationMap = {};
        const floor = NavigationData.floors[floorId];

        //For each node in the floor
        for (let roomId of Object.keys(NavigationData.floors[floorId]))
            //Set distance to Infinity and predecessorId to null (since we don´t know it yet)
            navigationMap[roomId] = {distance: Infinity, predecessorId: null, processed: false};

        //Set the distance from the start node to 0 (it takes us nothing to stand still ^^) and predecessorId to null since it has none
        navigationMap[startId] = {processed: true, distance: 0, predecessorId: null};

        let currentNodeId;

        //While there are unprocessed nodes, get cheapest
        while(currentNodeId = this.getCheapestNode(startId, navigationMap)) {

            //For each connected node
            for (let connectedId of floor[currentNodeId].connectedTo) {
                //Calculate distance over our current cheapest node
                let distance = navigationMap[currentNodeId].distance + Navigator.getPathLength(floor[currentNodeId], floor[connectedId]);

                //If the distance over our current cheapest is higher than the old one
                if (navigationMap[connectedId].distance <= distance)
                    continue;

                //Update distance to the distance over our current cheapest node and set the predecessorId to out current cheapest node
                navigationMap[connectedId].distance = distance;
                navigationMap[connectedId].predecessorId = currentNodeId;
            }

            //Mark our current node as processed
            navigationMap[currentNodeId].processed = true;
        }

        //Create an array for our result path and put the destination in it
        const path = [destinationId];

        //Set the current node id to our destination
        currentNodeId = destinationId;

        //While our currentNode has an predecessor
        while (currentNodeId = navigationMap[currentNodeId].predecessorId)
            //Add predecessor to the beginning of the array
            path.unshift(currentNodeId);

        //Return our path
        return path;
    }

    getCheapestNode(nodeId: number, map: NavigationMap) {
        return Object.keys(map).reduce((current, lowest) => {
            if(!lowest || !map[current].processed && map[current].distance < map[lowest].distance)
                return current;
            return lowest;
        }, undefined);
    }

    static getPathLength(room1: ClassRoom, room2: ClassRoom) {
        //Thanks Pythagoras ^^
        return Math.sqrt(Math.pow(room1.location.x - room2.location.x, 2) + Math.pow(room2.location.x + room1.location.x, 2));
    }
}

//Export initialized navigator
export default new Navigator();