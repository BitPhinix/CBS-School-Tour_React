import * as React from "react"
import {AutoSizer} from 'react-virtualized';
import {ReactSVGPanZoom, TOOL_PAN} from "react-svg-pan-zoom";
import SvgLoader from "./svgLoader";
const Style = require("./map.css");

class Map extends React.Component<{}, {}> {
    /*render() {
        return(
            <div style={Style} className="mapContainer">
                <AutoSizer>
                    {(({width, height}) => width === 0 || height === 0 ? null : (
                        <ReactSVGPanZoom
                            className="map"
                            width={width}
                            height={height}
                            tool={TOOL_PAN}>

                        </ReactSVGPanZoom>
                    ))}
                </AutoSizer>
            </div>
        );
    }*/

    render() {
        return (
            <div style={Style} className="mapContainer">
                <SvgLoader/>
            </div>
        );
    }
}

export default Map;