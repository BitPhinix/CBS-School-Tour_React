import {Node} from "../typings";
const NavigationData = require("../../navData/data.json");

class NavigationHelper {

    getResults(text: string): Node[] {
        const result = [];
        const searchNumber = NavigationHelper.getNumber(text);
        const searchString = NavigationHelper.getQueryString(text);

        NavigationHelper.iterateNodes((node) => {
            //If node.description includes searchString or node number starts with searchNumber
            if(!node.hidden && searchString && node.description && node.description.toLowerCase().includes(searchString) ||
                searchNumber && node.number && node.number.toString().startsWith(searchNumber))
                //Add node to result
                result.push(node);

            //Continue
            return true;
        });

        return result;
    }

    getNode(text: string): Node {
        let result;
        const searchNumber = NavigationHelper.getNumber(text);

        if(searchNumber) {
            NavigationHelper.iterateNodes((node) => {
                if(searchNumber && node.number == parseInt(searchNumber))
                    result = node;

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

        //Nothing was found, return undefined
        return;
    }

    private static getNumber(text: string) {
        //Get numbers out of text ("d12a da4" => "124")
        return text.replace(/[^0-9]*/, "");
    }

    private static getQueryString(text: string) {
        //Remove numbers, convert text to lowercase, remove unnecessary whitespaces
        return text.replace(/[0-9]*/, "").toLowerCase().trim();
    }

    private static iterateNodes(delegate: (node: Node) => boolean) {
        //For each floorId in floors
        for (let floorId of Object.keys(NavigationData.floors)) {
            let floor = NavigationData.floors[floorId];

			//For each node in the floor
            for (let roomId of Object.keys(floor.nodes)) {
                //If result is false
                if(!delegate(floor.nodes[roomId]))
                    //Break
                    return;
            }
        }
    }
}

export default new NavigationHelper();