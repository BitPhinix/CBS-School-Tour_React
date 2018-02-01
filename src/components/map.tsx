import * as React from "react";
import SvgRenderer from "./svgRenderer";
import * as SliderActions from "../actions/sliderActions";
import navigationStore from "../stores/navigationStore";
import {ReactElement} from "react";
const Style = require("./map.css");

class Map extends React.Component<{}, {
    overlay: ReactElement<SVGElement>[][],
    currentFloor: number
}> {

    svgRenderer;

    constructor(props) {
        super(props);

        //Default state
        this.state = {overlay: [], currentFloor: 1};

        //Hook up change event
        navigationStore.on("change", () => this.updateState());
    }

    componentDidMount() {
        this.updateState();
    }

    //TODO: Rewrite
    updateState() {
        this.setState(navigationStore.state);
        this.svgRenderer.setOverlay(this.state.overlay[this.state.currentFloor]);
    }

    render() {
        return (
            <div style={Style} className="mapContainer"
                onMouseDown={() => SliderActions.hide()}>
                <SvgRenderer ref={(svgRenderer) => this.svgRenderer = svgRenderer}/>
            </div>
        );
    }
}

export default Map;