import dispatcher from "../dispatcher";
import {ClassRoom} from "../typings";

export function navigate(start: number, destination: number) {
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
