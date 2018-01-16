import {ClassRoom} from "../typings";

const NavigationData = require("../../navData/data.json");

class NavigationHelper {

    static getResults(text: string): ClassRoom[] {
        const result = [];

        //Get numbers out of text ("d12a da4" => "124")
        const searchNumber = text.replace(/[^0-9]*/, "");

        //Remove numbers, convert text to lowercase, remove unnecessary whitespaces
        const searchString = text.replace(/[0-9]*/, "").toLowerCase().trim();

        //For each floorId in floors
        for (let floorId of Object.keys(NavigationData.floors)) {
            let floor = NavigationData.floors[floorId];

            //For each room in the floor
            for (let roomId of Object.keys(floor)) {
                let room = floor[roomId];

                //If room is hidden
                if(room.hidden)
                    //Continue
                    continue;

                //If room.description includes searchString or room number starts with searchNumber
                if(searchString && room.description && room.description.toLowerCase().includes(searchString) ||
                    searchNumber && room.number && room.number.toString().startsWith(searchNumber))
                        //Add room to result
                        result.push(room);
            }
        }

        return result;
    }
}

export default NavigationHelper;