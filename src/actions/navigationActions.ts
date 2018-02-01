import dispatcher from "../dispatcher";
import {ClassRoom} from "../typings";

export function navigate(start: ClassRoom, destination: ClassRoom) {
    dispatcher.dispatch({
       type: "NAVIGATE",
       start,
       destination
    });
}

export function zoomTo(room: ClassRoom) {
    dispatcher.dispatch({
        type: "ZOOM_TO",
        room
    });
}

export function changeFloor(floorId: number) {
    dispatcher.dispatch({
        type: "CHANGE_FLOOR",
        floorId
    });
}
