import dispatcher from "../dispatcher";
import {Node} from "../typings";

export function navigate(start: Node, destination: Node) {
    dispatcher.dispatch({
       type: "NAVIGATE",
       start,
       destination
    });
}

export function zoomTo(node: Node) {
    dispatcher.dispatch({
        type: "ZOOM_TO",
        node
    });
}

export function changeFloor(floorId: number) {
    dispatcher.dispatch({
        type: "CHANGE_FLOOR",
        floorId
    });
}
