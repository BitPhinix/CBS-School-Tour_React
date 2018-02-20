import "./map.css";
import * as React from "react";
import SvgRenderer from "./svgRenderer";
import mapStore from "../../stores/mapStore";
import {ReactElement} from "react";
import ChangeFloorBehaviour from "./svgBehaviours/changeFloorBehaviour";
import Navigator from "../../utils/navigator";
import {Point} from "../../typings";
import mapUtils from "../../utils/mapUtils";
import ZoomToPointBehaviour from "./svgBehaviours/zoomToPointBehaviour";

class Map extends React.Component<{}, {
    overlay: {[floorId: number]: ReactElement<SVGElement>[]},
    currentFloor: number
}> {

    svgRenderer: SvgRenderer;

    constructor(props) {
        super(props);

        //Default state
        this.state = {overlay: {}, currentFloor: undefined};

        //Hook up change event
        mapStore.on("change", () => this.updateState());
        mapStore.on("zoomToNode", (args) => this.zoomToNode(args.node))
    }

    componentDidMount() {
        //Update state when component mounts
        this.updateState();
    }

    zoomToNode(node) {
		if(this.state.currentFloor != mapStore.state.currentFloor)
			this.changeFloor(mapUtils.getFloorId(node), this.toRelativeCoordinates(node.location), 2);
		else
			this.svgRenderer.processBehaviour(new ZoomToPointBehaviour(2, this.toRelativeCoordinates(node.location)));
	}

    updateState() {
        //Load new map if floor has changed
        if(this.state.currentFloor != mapStore.state.currentFloor)
        	this.changeFloor(mapStore.state.currentFloor, this.toRelativeCoordinates(mapUtils.getFloorCenter(mapStore.state.currentFloor)), 1);

        //Get state from mapStore
        this.setState(mapStore.state);
    }

    private changeFloor(floorId: number, initialTransform: Point, initialScale: number) {
    	//Load map
		this.svgRenderer.processBehaviour(new ChangeFloorBehaviour(mapStore.state.currentFloor, initialTransform, initialScale, mapStore.state.overlay[mapStore.state.currentFloor]));
	}

	private toRelativeCoordinates(point: Point) {
    	return {
    		x: this.svgRenderer.svg.clientWidth / 2 - point.x,
			y: this.svgRenderer.svg.clientHeight / 2 - point.y
		}
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