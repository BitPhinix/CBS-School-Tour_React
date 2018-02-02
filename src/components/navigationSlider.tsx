import * as React from "react";
import * as SliderActions from "../actions/sliderActions";
import sliderStore from "../stores/sliderStore";

class NavigationSlider extends React.Component<{}, {visible: boolean, component: React.Component}> {

    constructor(props) {
        super(props);

        //Hook up change event
        sliderStore.on("change", () => this.updateState());

        //Default state
        this.state = {visible: false, component: null};
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
                <div className="closeContainer">
                    <div className="iconContainer" onClick={() => SliderActions.hide() }>
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 128 128">
                            <polygon fill="ffffff" points="128.001,5.672 122.314,0 63.996,58.324 5.682,0 0,5.682 58.323,63.996 0.01,122.314 5.682,128.001 64.005,69.683 122.314,127.991 128.001,122.314 69.682,63.996"/>
                        </svg>
                    </div>
                </div>
                {this.state.component && this.state.component.render ? this.state.component.render(): null}
            </div>
        );
    }
}

export default NavigationSlider;