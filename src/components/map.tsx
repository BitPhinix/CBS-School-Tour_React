import * as React from "react"
import {AutoSizer} from 'react-virtualized';
import {ReactSVGPanZoom, TOOL_PAN} from "react-svg-pan-zoom";
const Style = require("./map.css");

class Map extends React.Component<{}, {}> {

    render() {
        return(
            <div style={Style} className="mapContainer">
                <AutoSizer>
                    {(({width, height}) => width === 0 || height === 0 ? null : (
                        <ReactSVGPanZoom
                            className="map"
                            width={width}
                            height={height}
                            tool={TOOL_PAN}>
                            <svg width={1440} height={1440}/>
                        </ReactSVGPanZoom>
                    ))}
                </AutoSizer>
            </div>
        );
    }
}

export default Map;