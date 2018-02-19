import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import navigator from "../utils/navigator";
import {Node} from "../typings";
import {ReactElement} from "react";
import SvgDraw from "../utils/svgDraw";

class MapStore extends EventEmitter {

    state: {
        overlay: {[floorId: number]: ReactElement<SVGElement>[]},
        currentFloor: number
    };

    constructor() {
        super();

        //Default state
        this.state = {overlay: {}, currentFloor: 1};
    }

    navigate(start: Node, destination: Node) {
        //Calculate path
        const paths = navigator.navigateGlobal(start, destination);

        //For each floor
        for (let floorId of Object.keys(paths))
            //Draw overlay for path and store it
            this.state.overlay[floorId] = SvgDraw.getOverlay(navigator.toPointArray(paths, floorId));

        //Emit change
        this.emit("change");
    }

    zoomTo(node: Node) {
        //Emit zoomToRoom
        this.emit("zoomToRoom", {node});
    }

    changeFloor(floorId: number) {
        //Update currentFloor
        this.state.currentFloor = floorId;

        //Emit change
        this.emit("change");
    }

    handleActions(action) {
        switch(action.type) {
            case "NAVIGATE":
                this.navigate(action.start, action.destination);
                break;

            case "ZOOM_TO":
                this.zoomTo(action.node);
                break;

            case "CHANGE_FLOOR":
                this.changeFloor(action.floorId);
                break;
        }
    }
}

//Initialize new MapStore
const mapStore = new MapStore();

//Register mapStore to dispatcher
dispatcher.register(mapStore.handleActions.bind(mapStore));

export default mapStore;