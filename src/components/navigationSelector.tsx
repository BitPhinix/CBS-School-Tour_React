import * as React from "react";
import "./autoCompleteContainer.css";
import navigationHelper from "../utils/navigationHelper";
import AutoCompleteContainer from "./autoCompleteContainer";
import * as Toastr from "toastr";
const Style = require("./navigationSelector.css");

class NavigationSelector extends React.Component<{start?: string, destination?: string}, {}> {

    activeElement: HTMLInputElement;
    startInput: HTMLInputElement;
    destinationInput: HTMLInputElement;
    container: AutoCompleteContainer;

    constructor(props) {
        super(props);
    }

    onRecommendationClick(number: number) {
        //Update the value of the active input
        this.activeElement.value = "Raum " + number;

        //Update the container
        this.updateContainer();
    }

    componentDidMount() {
        //Make container visible
        this.container.setVisibility(true);

        //Set destinationInput value
        if(this.props.destination)
            this.destinationInput.value = this.props.destination;

        //Set startInput value
        if(this.props.start)
            this.startInput.value = this.props.start;
    }

    onInputSelect(event) {
        //Set activeElement to event target
        this.activeElement = event.target as HTMLInputElement;

        //Update the container
        this.updateContainer();
    }

    updateContainer() {
        //Update container to complete the value out of the active element
        this.container.update(this.activeElement.value);
    }

    onKeyDown(event) {
        //If key isn´t Enter
        if(event.keyCode != 13)
            return;

        //Try to navigate
        this.tryNavigate(true);
    }

    tryNavigate(showErrors: boolean) {
        //Try to get start and destination room
        const start = navigationHelper.getRoom(this.startInput.value);
        const destination = navigationHelper.getRoom(this.destinationInput.value);

        if(!start && showErrors)
            Toastr.error("Start wurde nicht gefunden oder ist nicht eindeutig!");
        if(!destination && showErrors)
            Toastr.error("Ziel wurde nicht gefunden oder ist nicht eindeutig!");

        if(destination && start)
            //TODO Navigate
            return;
    }

    onSwapClick() {
        //Swap text of the inputs
        const holder = this.startInput.value;
        this.startInput.value = this.destinationInput.value;
        this.destinationInput.value = holder;

        //Focus activeElement (this will also update the container)
        this.activeElement.focus();
    }

    render() {

        return(
            <div className="navigationSelector" style={Style}>
                    <div className="iconContainer leftContainer">
                        <img onClick={() => this.startInput.focus()} className="beginingImg" src="./svg/nav/begining.svg"/>

                        <div className="dotContainer">
                            <img className="dotImg" src="./svg/nav/dot.svg"/>
                        </div>
                        <div className="dotContainer">
                            <img className="dotImg" src="./svg/nav/dot.svg"/>
                        </div>
                        <div className="dotContainer">
                            <img className="dotImg" src="./svg/nav/dot.svg"/>
                        </div>

                        <img onClick={() => this.destinationInput.focus()} className="destinationImg" src="./svg/nav/destination.svg"/>
                    </div>

                    <div className="inputContainer">
                        <div className="group">
                            <input
                                className="startInput"
                                onSelect={(event) => this.onInputSelect(event)}
                                onInput={() => this.updateContainer()}
                                onKeyDown={(event) => this.onKeyDown(event)}
                                ref={(input) => this.startInput = input}
                                type="text" required/>
                            <span className="highlight"/>
                            <span className="bar"/>
                            <label>Start</label>
                        </div>
                        <div className="group">
                            <input
                                className="destinationInput"
                                onSelect={(event) => this.onInputSelect(event)}
                                onInput={() => this.updateContainer()}
                                onKeyDown={(event) => this.onKeyDown(event)}
                                ref={(input) => this.destinationInput = input}
                                type="text" required/>
                            <span className="highlight"/>
                            <span className="bar"/>
                            <label>Ziel</label>
                        </div>
                    </div>

                    <div className="iconContainer rightContainer">
                        <img onClick={() => this.onSwapClick()} src="./svg/nav/reverse.svg"/>
                    </div>

                <AutoCompleteContainer
                    ref={(container) => this.container = container}
                    onRecommendationClick={(number) => this.onRecommendationClick(number)}/>
            </div>);
    }
}

export default NavigationSelector;