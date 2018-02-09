import "./map.css";
import * as React from "react";
import SvgRenderer from "./svgRenderer";
import navigationStore from "../stores/navigationStore";
import * as SliderActions from "../actions/sliderActions"
import {ReactElement} from "react";

class Map extends React.Component<{}, {
    overlay: {[floorId: number]: ReactElement<SVGElement>[]},
    currentFloor: number
}> {

    svgRenderer;

    constructor(props) {
        super(props);

        //Default state
        this.state = {overlay: {}, currentFloor: 1};

        //Hook up change event
        navigationStore.on("change", () => this.updateState());
    }

    componentDidMount() {
        //Update state when component mounts
        this.updateState();
    }

    updateState() {
        //Load new map if floor has changed
        if(this.state.currentFloor != navigationStore.state.currentFloor)
            this.svgRenderer.load("./svg/" + navigationStore.state.currentFloor + ".svg");

        //Get state from navigationStore
        this.setState(navigationStore.state);
    }

    componentDidUpdate() {
        //Update overlay when map updates
        this.svgRenderer.setOverlay(this.state.overlay[this.state.currentFloor]);
    }

    render() {
        return (
            <div className="mapContainer"
                 onClick={() => SliderActions.hide()}>
                <SvgRenderer ref={(svgRenderer) => this.svgRenderer = svgRenderer}/>
            </div>
        );
    }
}

export default Map;