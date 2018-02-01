import {Point} from "../typings";
import * as React from "react";
import {ReactElement} from "react";
import {posix} from "path";

class SvgDraw {

    //This draws the path with as little lines as possible
    getOverlay(path: Point[]): ReactElement<SVGElement>[] {
        //Create result array and add start to it
        const result = [SvgDraw.getNavStart(path[0])];

        //If path is only 1 node long
        if(path.length == 1)
            return result;

        let lineStart = path[0];
        let linePitch = null;

        //Iterate over all path nodes
        for (let i = 0; i < path.length; i++) {
            //If linePitch is null
            if(!linePitch)
                //Calculate it
                linePitch = SvgDraw.getPitch(lineStart, path[i]);

            //If our current node isn´t the first one and it has another pitch than the last node or it is the last node
            if(i != 0 && (i == path.length - 1 || linePitch != SvgDraw.getPitch(lineStart, path[i + 1]))) {
                //Draw line from lineStart to current node
                result.push(SvgDraw.getNavigationLine(lineStart, path[i], i));

                //if node isn´t last one
                if(i != path.length - 1)
                    //Draw a corner piece
                    result.push(SvgDraw.getNavigationCorner(path[i]));

                //Set lineStart to current node and linePitch to null since we don´t know it yet
                lineStart = path[i];
                linePitch = null;
            }
        }

        //Add navEnd to result
        result.push(SvgDraw.getNavEnd(path[path.length - 1]));

        return result;
    }

    static getPitch(p1: Point, p2: Point) {
        //Calculated the pitch between the two points and return it (|delta y| / |delta x|)
        return Math.abs(p1.y - p2.y) / Math.abs(p1.x - p2.x);
    }

    static getNavStart(position: Point) {
        return <circle className="navStart" r="20" cx={position.x} cy={position.y} fill="red"/>
    }

    static getNavEnd(position: Point) {
        return <circle className="navEnd" r="10" cx={position.x} cy={position.y} fill="red"/>
    }

    static getNavigationCorner(position: Point) {
        return <circle className="navCorner" r="5" cx={position.x} cy={position.y} fill="red"/>
    }

    static getNavigationLine(p1: Point, p2: Point, key) {
        //Return a line between p1 and p2 with the key of the key parameter
        return <line className="navLine" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} key={key}/>;
    }
}

export default new SvgDraw();