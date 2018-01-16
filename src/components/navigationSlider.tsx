import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import * as SliderActions from "../actions/sliderActions";
import sliderStore from "../stores/sliderStore";
const Style = require("./navigationSlider.css");

class NavigationSlider extends React.Component<{}, {visible: boolean, components: React.Component[]}> {

    constructor(props) {
        super(props);
        sliderStore.on("change", () => this.updateState());
        this.state = {visible: false, components: []};
    }

    componentDidMount() {
        this.state = sliderStore.state;
    }

    updateState() {
        this.setState(sliderStore.state);
    }

    render() {
        const renderedComponents = this.state.components.map(function (element) {
            return element.render();
        });

        const visible = this.state.visible ? "visible" : "closed";

        return(
            <div className={"navigationSlider " + visible} style={Style}>
                <div className="closeContainer">
                    <FontAwesome name="times" onClick={() => SliderActions.hide()}/>
                </div>
                {renderedComponents}
            </div>
        );
    }
}

export default NavigationSlider;