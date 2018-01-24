import * as React from "react";
import SvgLoader from "./svgLoader";
const Style = require("./map.css");

class Map extends React.Component<{onSvgLoaded?: () => any}, {filePath: string}> {


    constructor(props) {
        super(props);

        //Default state
        this.state = {filePath: ""};
    }

    componentDidMount() {
        //Load default svg
        this.load("./svg/1.svg");
    }

    load(path: string) {
        //Set filePath
        this.setState({filePath: path});
    }

    render() {
        return (
            <div style={Style} className="mapContainer">
                <SvgLoader/>
            </div>
        );
    }
}

export default Map;