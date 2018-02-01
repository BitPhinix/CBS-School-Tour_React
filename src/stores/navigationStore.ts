import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import navigator from "../utils/navigator";
import {ClassRoom} from "../typings";
import {ReactElement} from "react";
import SvgDraw from "../utils/svgDraw";
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;

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
        //Calculate path
        const paths = navigator.navigateGlobal(start, destination);

        //For each floor
        for (let floorId of Object.keys(paths))
            //Draw overlay for path and store it
            this.state.overlay[floorId] = SvgDraw.getOverlay(navigator.toPointArray(paths, floorId));

        //Emit change
        this.emit("change");
    }

    zoomTo(number: number) {

    }

    changeFloor(floorId: number) {
        //Update currentFloor and emit change
        this.state.currentFloor = floorId;
        this.emit("change");
    }

    handleActions(action) {
        switch(action.type) {
            case "NAVIGATE":
                this.navigate(action.start, action.destination);
                break;

            case "ZOOM_TO":
                this.zoomTo(action.room);
                break;

            case "CHANGE_FLOOR":
                this.changeFloor(action.floorId);
                break;
        }
    }
}

//Initialize new navigationStore
const navigationStore = new NavigationStore();

//Register navigationStore to dispatcher
dispatcher.register(navigationStore.handleActions.bind(navigationStore));

export default navigationStore;