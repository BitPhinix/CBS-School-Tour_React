import * as React from "react";
import SvgRenderer from "./svgRenderer";
const Style = require("./map.css");

class Map extends React.Component<{}, {}> {

    svgRenderer;

    componentDidMount() {
        this.svgRenderer.addOverlayElement(<path d="M150 0 L75 200 L225 200 Z" />);
    }

    drawPath() {

    }

    render() {
        return (
            <div style={Style} className="mapContainer">
                <SvgRenderer ref={(svgRenderer) => this.svgRenderer = svgRenderer}/>
            </div>
        );
    }
}

export default Map;