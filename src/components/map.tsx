import * as React from "react";
const Style = require("./map.css");

class Map extends React.Component<{}, {}> {

    render() {
        return(
            <div className="Map" style={Style}>
                Map
            </div>
        );
    }
}

export default Map;