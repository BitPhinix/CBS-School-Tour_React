import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import navigator from "../utils/navigator";
import {ClassRoom} from "../typings";
import {ReactElement} from "react";
import svgDraw from "../utils/svgDraw";

//TODO: Rewrite
class NavigationStore extends EventEmitter {

    state: {
        overlay: ReactElement<SVGElement>[][],
        currentFloor: number
    };

    constructor() {
        super();

        //Default state
        this.state = {overlay: [], currentFloor: 1};
    }

    navigate(start: ClassRoom, destination: ClassRoom) {
        const paths = navigator.navigateGlobal(start, destination);

        for (let floorId of Object.keys(paths))
            this.state.overlay[floorId] = svgDraw.getOverlay(navigator.toPointArray(paths, floorId));

        this.emit("change");
    }

    zoomTo(number: number) {

    }

    handleActions(action) {
        switch(action.type) {
            case "NAVIGATE":
                this.navigate(action.start, action.destination);
                break;

            case "ZOOM_TO":
                this.zoomTo(action.room);
                break;
        }
    }
}

//Initialize new navigationStore
const navigationStore = new NavigationStore();

//Register navigationStore to dispatcher
dispatcher.register(navigationStore.handleActions.bind(navigationStore));

export default navigationStore;