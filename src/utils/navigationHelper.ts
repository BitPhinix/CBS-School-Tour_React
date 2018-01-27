import {ClassRoom} from "../typings";
const NavigationData = require("../../navData/data.json");

class NavigationHelper {

    getResults(text: string): ClassRoom[] {
        const result = [];
        const searchNumber = NavigationHelper.getNumber(text);
        const searchString = NavigationHelper.getQueryString(text);

        NavigationHelper.iterateRooms((room) => {
            //If room.description includes searchString or room number starts with searchNumber
            if(!room.hidden && searchString && room.description && room.description.toLowerCase().includes(searchString) ||
                searchNumber && room.number && room.number.toString().startsWith(searchNumber))
                //Add room to result
                result.push(room);

            //Continue
            return true;
        });

        return result;
    }

    getRoom(text: string): ClassRoom {
        let result;
        const searchNumber = NavigationHelper.getNumber(text);

        if(searchNumber) {
            NavigationHelper.iterateRooms((room) => {
                if(searchNumber && room.number == parseInt(searchNumber))
                    result = room;

                //Only continue when no result was found
                return !result;
            });

            //When result was found
            if(result)
                //Return result
                return result;
        }

        //Try to auto-complete the result
        const searchResults = this.getResults(text);

        //If exactly 1 result was found
        if(searchResults.length == 1)
            //Return result
            return searchResults[0];

        //Nothing was found, return null
        return null;
    }

    private static getNumber(text: string) {
        //Get numbers out of text ("d12a da4" => "124")
        return text.replace(/[^0-9]*/, "");
    }

    private static getQueryString(text: string) {
        //Remove numbers, convert text to lowercase, remove unnecessary whitespaces
        return text.replace(/[0-9]*/, "").toLowerCase().trim();
    }

    private static iterateRooms(delegate: (room: ClassRoom) => boolean) {
        //For each floorId in floors
        for (let floorId of Object.keys(NavigationData.floors)) {
            let floor = NavigationData.floors[floorId];

            //For each room in the floor
            for (let roomId of Object.keys(floor)) {

                //If result is false
                if(!delegate(floor[roomId]))
                    //Break
                    return;
            }
        }
    }
}


const navigationHelper = new NavigationHelper();
export default navigationHelper;