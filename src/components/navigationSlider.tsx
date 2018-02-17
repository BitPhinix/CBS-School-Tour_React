import "./navigationSlider.css";
import * as React from "react";
import sliderStore from "../stores/sliderStore";

class NavigationSlider extends React.Component<{}, {visible: boolean, component: React.Component}> {

    constructor(props) {
        super(props);

        //Hook up change event
        sliderStore.on("change", () => this.updateState());

        //Default state
        this.state = {visible: false, component: undefined};
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
        //Get className for visible / invisible
        const visible = this.state.visible ? "visible" : "closed";

        return (
            <div className={"navigationSlider " + visible}>
                {this.state.component && this.state.component.render ? this.state.component.render(): undefined}
            </div>
        );
    }
}

export default NavigationSlider;