import * as React from "react";
import SvgRenderer from "./svgRenderer";
const Style = require("./map.css");

class Map extends React.Component<{}, {}> {

    svgRenderer;

    render() {
        return (
            <div style={Style} className="mapContainer">
                <SvgRenderer ref={(svgRenderer) => this.svgRenderer = svgRenderer}/>
            </div>
        );
    }
}

export default Map;