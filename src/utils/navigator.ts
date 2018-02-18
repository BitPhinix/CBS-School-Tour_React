import {ClassRoom, Point} from "../typings";
import mapUtils from "./mapUtils";
const NavigationData = require("../../navData/data.json");

interface NavigationMap {
    [roomId: number]: {predecessorId: string, distance: number, processed: boolean}
}

interface NavigationResult {
    [floorId: number]: {
        path: number[]
    }
}

class Navigator {
    toPointArray(navigationResult: NavigationResult, floorId): Point[] {
        return Object.keys(navigationResult[floorId]).map((roomKey) => {
            //Yeah, I know it´s ugly :(
            return NavigationData.floors[floorId][navigationResult[floorId][roomKey]].location;
        });
    }

    navigateGlobal(start: ClassRoom, destination: ClassRoom): NavigationResult {
        //Get the floors of the start, destination
        const startFloor = mapUtils.getFloorId(start.number);
        const destinationFloor = mapUtils.getFloorId(destination.number);

        //Calculate the difference of floors
        const floorDiv = Math.abs(startFloor - destinationFloor);

        //Check if we have to go downwards
        const downwards = startFloor < destinationFloor;

        //Set the current pos to start
        let currentPos = start;

        const result = {};

        //For each floor that
        for (let i = 0; i < floorDiv; i++) {
            //Calculate the current floor
            let floor = startFloor + (downwards ? i : -i);

            //Get the staircase we have to go to
            let stairCase = this.findStaircase(currentPos.number, floor, (downwards ? 1 : -1));

            //Navigate to the staircase and put it in the result array
            result[floor] = this.navigateFloor(currentPos.number, stairCase.number, floor);

            //Update currentPos to Staircase
            currentPos = stairCase;
        }

        //Navigate from staircase to destination
        result[destinationFloor] = this.navigateFloor(currentPos.number, destination.number, destinationFloor);

		console.log(result[destinationFloor]);

		//Return result
        return result;
    }

    private findStaircase(currentNodeId: number, floorId: number, leadTo: number): ClassRoom {
        //Get the floor
        const floor = NavigationData.floors[floorId];
        
        //Get all Staircases that lead to the desired floor (1, -1)
        const stairCaseIds = Object.keys(floor).filter(function (roomId) {
            return floor[roomId].leadTo == leadTo;
        });

        let result;
        let lowestCost = 0;

        //For each staircase in the viable Staircases
        for (let stairCaseId of stairCaseIds) {
            //Get the cost it takes to get there
            let cost = mapUtils.getPathLength(floor[stairCaseId], floor[currentNodeId]);

            //Check if it is cheaper than the cheapest one checked or if result was not initialized
            if(!result || cost < lowestCost) {
                //Set the result to the current staircase
                result = stairCaseId;

                //Update lowest cost
                lowestCost = cost;
            }
        }

        //Return the result
        return floor[result];
    }

    //Big thanks to https://www.youtube.com/watch?v=GazC3A4OQTE&t=278s
    private navigateFloor(startId: number, destinationId: number, floorId: number): number[] {
        const navigationMap: NavigationMap = {};
        const floor = NavigationData.floors[floorId];

        //For each node in the floor
        for (let roomId of Object.keys(NavigationData.floors[floorId]))
            //Set distance to Infinity and predecessorId to undefined (since we don´t know it yet)
            navigationMap[roomId] = {distance: Infinity, predecessorId: undefined, processed: false};

        //Set the distance from the start node to 0 (it takes us nothing to stand still ^^) and predecessorId to undefined since it has none
        navigationMap[startId] = {processed: false, distance: 0, predecessorId: undefined};

        let currentNodeId;

        //While there are unprocessed nodes, get cheapest
        while(currentNodeId = this.getCheapestNode(navigationMap)) {

            //For each connected node
            for (let connectedId of floor[currentNodeId].connectedTo) {
                //Calculate distance over our current cheapest node
                let distance = navigationMap[currentNodeId].distance + mapUtils.getPathLength(floor[currentNodeId], floor[connectedId]);

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

    private getCheapestNode(map: NavigationMap) {
        //Find cheapest node and return it
        return Object.keys(map).reduce((lowest, current) => {

            //Check if our current node has a lower distance and hasn't been processed yet
            if((!lowest || map[current].distance < map[lowest].distance) && !map[current].processed)
                //Set lowest to current
                return current;

            //Keep our current lowest
            return lowest;

           //lowest is undefined at the beginning
        }, undefined);
    }
}

//Export initialized navigator
export default new Navigator();