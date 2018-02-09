import "./map.css";
import * as React from "react";
import SvgRenderer from "./svgRenderer";
import mapStore from "../stores/mapStore";
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
        mapStore.on("change", () => this.updateState());
    }

    componentDidMount() {
        //Update state when component mounts
        this.updateState();
    }

    updateState() {
        //Load new map if floor has changed
        if(this.state.currentFloor != mapStore.state.currentFloor)
            this.svgRenderer.load("./svg/" + mapStore.state.currentFloor + ".svg");

        //Get state from mapStore
        this.setState(mapStore.state);
    }

    componentDidUpdate() {
        //Update overlay when map updates
        this.svgRenderer.setOverlay(this.state.overlay[this.state.currentFloor]);
    }

    render() {
        return (
            <div className="mapContainer">
                <SvgRenderer ref={(svgRenderer) => this.svgRenderer = svgRenderer}/>
            </div>
        );
    }
}

export default Map;