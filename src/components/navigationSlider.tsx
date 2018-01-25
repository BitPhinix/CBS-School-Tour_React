import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import * as SliderActions from "../actions/sliderActions";
import sliderStore from "../stores/sliderStore";
const Style = require("./navigationSlider.css");

class NavigationSlider extends React.Component<{}, {visible: boolean, components: React.Component[]}> {

    constructor(props) {
        super(props);

        //Hook up change event
        sliderStore.on("change", () => this.updateState());

        //Default state
        this.state = {visible: false, components: []};
    }

    componentDidMount() {
        //Load state from store
        this.state = sliderStore.state;
    }

    updateState() {
        //Update state from store
        this.setState(sliderStore.state);
    }


    render() {
        //For each component map rendered one
        const renderedComponents = this.state.components.map(function (element) {
            //Render element
            return element.render();
        });

        //Get className for visible / invisible
        const visible = this.state.visible ? "visible" : "closed";

        return(
            <div className={"navigationSlider " + visible} style={Style}>
                <div className="closeContainer">
                    <div className="imageContainer">
                        <img src="./svg/nav/cross.svg" onClick={() => SliderActions.hide()}/>
                    </div>
                </div>
                {renderedComponents}
            </div>
        );
    }
}

export default NavigationSlider;