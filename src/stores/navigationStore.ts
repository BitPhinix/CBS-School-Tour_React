import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import {ClassRoom} from "../typings";

class NavigationStore extends EventEmitter {

    state: {
        navigating: boolean,
        destination: number,
        start: number,
        zoomTarget: number
    };

    constructor() {
        super();
    }

    navigate(start: number, destination: number) {
        this.state.start = start;
        this.state.destination = destination;
        this.state.navigating = true;
        this.emit("navigate");
        this.emit("change");
    }

    zoomTo(number: number) {
        this.state.zoomTarget = number;
        this.emit("zoom");
        this.emit("change");
    }

    handleActions(action) {
        switch(action.type) {
            case "NAVIGATE": {
                this.navigate(action.start, action.destination);
            }

            case "ZOOM_TO": {
                this.zoomTo(action.room);
            }
        }
    }
}

//Initialize new navigationStore
const navigationStore = new NavigationStore();

//Register navigationStore to dispatcher
dispatcher.register(navigationStore.handleActions.bind(navigationStore));

export default navigationStore;