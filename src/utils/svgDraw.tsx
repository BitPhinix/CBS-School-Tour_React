import {Point} from "../typings";
import * as React from "react";

class SvgDraw {

    //TODO: Path should look nicer !

    getOverlay(path: Point[]) {
        //Create result array
        const result = [];

        //Iterate over path (excluding last element)
        for (let i = 0; i < path.length - 1; i++)
            //Draw a line from current to next node and add it to result (element key is index pos)
            result[i] = SvgDraw.getNavigationLine(path[i], path[i + 1], i);

        //Return result
        return result;
    }

    static getNavigationLine(p1: Point, p2: Point, key) {
        //Return a line between p1 and p2 with the key of the key parameter
        return <line className="navLine" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} key={key}/>;
    }
}

export default new SvgDraw();