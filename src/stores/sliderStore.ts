import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import NavigationSelector from "../components/navigationSelector";
import * as React from "react";

class SliderStore extends EventEmitter {

    state;

    constructor() {
        super();

        this.state = {
            visible: false,
            component: React.Component
        }
    }

    toggle() {
        this.setVisibility(!this.state.visible);
    }

    showNavigation() {
        this.state.component = new NavigationSelector({});
        this.setVisibility(true);
        this.emit("change");
    }

    setVisibility(visible: boolean) {
        this.state.visible = visible;
        this.emit("change");
    }

    handleActions(action) {
        switch(action.type) {
            case "TOGGLE_NAVSLIDER":
                this.toggle();
                break;

            case "SET_NAVSLIDER":
                this.setVisibility(action.visible);
                break;

            case "NAVSLIDER_SHOW_NAVIGATION":
                this.showNavigation();
                break;
        }
    }
}

//Initialize new SliderStore
const sliderStore = new SliderStore();

//Register sliderStore to dispatcher
dispatcher.register(sliderStore.handleActions.bind(sliderStore));

export default sliderStore;