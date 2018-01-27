import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import {ClassRoom} from "../typings";

class NavigationStore extends EventEmitter {

    state: {

    };

    constructor() {
        super();
    }

    navigate(start: number, destination: number) {

    }

    zoomTo(number: number) {

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