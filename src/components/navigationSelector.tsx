import "./navigationSelector.css";
import * as React from "react";
import autoComplete from "../utils/autoComplete";
import AutoCompleteContainer from "./autoCompleteContainer";
import * as mapActions from "../actions/mapActions";
import * as sliderActions from "../actions/sliderActions";
import * as Toastr from "toastr";
import Untis from "../utils/untis";
import {HTMLAttributes} from "react";

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

        //Try to navigate
        this.tryNavigate(false);
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
        const start = autoComplete.getRoom(this.startInput.value);
        const destination = autoComplete.getRoom(this.destinationInput.value);

        if(!start && showErrors)
            Toastr.error("Start wurde nicht gefunden oder ist nicht eindeutig!");
        if(!destination && showErrors)
            Toastr.error("Ziel wurde nicht gefunden oder ist nicht eindeutig!");

        if(destination && start) {
            //Navigate
            mapActions.navigate(start, destination);

            //Close navigationSlider
            sliderActions.hide();
        }
    }

    onSwapClick() {
        //Swap text of the inputs
        const holder = this.startInput.value;
        this.startInput.value = this.destinationInput.value;
        this.destinationInput.value = holder;

        //Focus activeElement (this will also update the container)
        this.container.setVisibility(false)
    }

    render() {
        return(
            <div className="navigationSelector">

                <div className="blueContainer">

                    <div className="topContainer">

                        <div className="modeContainer">

                            <div className="iconContainer">
                                <div className="circleContainer">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="rgba(255, 255, 255, 0.85)" d="M288,112c22.223,0,39.997-17.776,39.997-40c0-22.225-17.774-40-39.997-40s-40.003,17.775-40.003,40   C247.997,94.224,265.777,112,288,112z"/>
                                        <path fill="rgba(255, 255, 255, 0.85)" d="M288,232h104v-40h-72l-44.802-69.333c-7.698-11.667-18.136-18.136-30.933-18.136c-3.198,0-8.828,0.531-12.799,1.747   L120,144v112h40v-80l40.531-16L120,480h40l56.698-164.271L267,384v96h38V352l-57.031-96l19.745-61.864L288,232z"/>
                                    </svg>
                                </div>
                            </div>

                            <div className="iconContainer" onClick={(event) => Untis.login()} >
                                <div className="circleContainer">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                        <path fill="rgba(255, 255, 255, 0.85)" stroke="#231F20" strokeWidth="3.3461" strokeMiterlimit="10" d="M64.014,74.898"/>
                                        <path fill="rgba(255, 255, 255, 0.85)" d="M50,6.507C26.934,6.507,8.233,25.982,8.233,50c0,24.021,18.701,43.492,41.767,43.492  c23.073,0,41.767-19.471,41.767-43.492C91.767,25.982,73.072,6.507,50,6.507z M50,83.979c-17.992,0-32.63-15.24-32.63-33.979  c0-18.736,14.638-33.979,32.63-33.979c17.99,0,32.626,15.243,32.626,33.979C82.626,68.738,67.989,83.979,50,83.979z"/>
                                        <path fill="rgba(255, 255, 255, 0.85)" d="M70.173,49.722L52.59,49.738V26.683c0-2.253-1.755-4.079-3.916-4.079c-2.164,0-3.914,1.826-3.914,4.079V55.97  c0,2.247,1.75,4.079,3.914,4.079c0.862,0,1.659-0.305,2.302-0.8l19.202-0.012c2.519,0,4.563-2.133,4.563-4.757  C74.741,51.854,72.696,49.722,70.173,49.722z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="topRightContainer">
                            <div className="closeContainer" onClick={() => {
                                sliderActions.hide();
                                this.container.setVisibility(false);
                            } }>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                    <polygon fill="#ffffff" points="95,15.588 84.412,5 50,39.412 15.588,5 5,15.588 39.412,50 5,84.412 15.588,95 50,60.588 84.412,95 95,84.412 60.588,50    "/>
                                </svg>
                            </div>
                        </div>

                    </div>

                    <div className="baseContainer">
                        <div className="leftContainer">

                            <div className="beginningContainer">
                                <svg viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#ffffff" opacity="1.00" d=" M 32.54 2.91 C 37.31 2.02 42.23 2.61 47.05 2.49 C 51.77 2.03 55.64 5.13 59.97 6.40 C 70.76 11.83 78.58 22.38 81.43 34.01 C 81.61 39.61 81.70 45.24 81.32 50.83 C 78.87 58.42 75.09 65.67 69.42 71.38 C 64.25 75.94 57.86 78.70 51.53 81.22 C 45.22 81.73 38.80 81.75 32.49 81.21 C 24.34 77.91 15.45 74.27 10.55 66.52 C 6.88 62.13 4.95 56.71 2.82 51.49 C 2.06 45.44 2.44 39.28 2.66 33.21 C 3.74 29.59 5.54 26.20 6.99 22.71 C 10.05 17.46 14.27 12.86 19.21 9.32 C 23.12 6.20 28.07 4.98 32.54 2.91 M 34.35 18.34 C 26.53 21.46 20.40 27.94 17.74 35.93 C 17.28 39.95 17.28 44.06 17.75 48.09 C 20.23 54.68 24.55 60.88 31.06 64.00 C 35.70 67.38 41.64 66.61 47.02 66.37 C 56.34 64.09 64.08 56.26 66.42 46.99 C 66.46 42.09 67.41 36.71 64.71 32.30 C 62.57 28.32 60.02 24.33 56.06 21.94 C 52.65 19.91 49.19 17.25 45.01 17.49 C 41.47 17.57 37.72 16.98 34.35 18.34 Z" />
                                </svg>
                            </div>

                            <div className="dotContainer">
                                <svg viewBox="0 0 34 34" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#eaeaea" opacity="1.00" d=" M 15.29 2.27 C 19.76 1.49 23.77 4.30 27.08 6.92 C 29.63 10.26 32.57 14.23 31.75 18.70 C 30.12 25.02 25.00 30.06 18.73 31.78 C 14.25 32.60 10.23 29.69 6.91 27.06 C 4.32 23.74 1.45 19.74 2.28 15.27 C 3.90 8.98 8.99 3.86 15.29 2.27 Z" />
                                </svg>
                            </div>

                            <div className="dotContainer">
                                <svg viewBox="0 0 34 34" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#eaeaea" opacity="1.00" d=" M 15.29 2.27 C 19.76 1.49 23.77 4.30 27.08 6.92 C 29.63 10.26 32.57 14.23 31.75 18.70 C 30.12 25.02 25.00 30.06 18.73 31.78 C 14.25 32.60 10.23 29.69 6.91 27.06 C 4.32 23.74 1.45 19.74 2.28 15.27 C 3.90 8.98 8.99 3.86 15.29 2.27 Z" />
                                </svg>
                            </div>

                            <div className="dotContainer">
                                <svg viewBox="0 0 34 34" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#eaeaea" opacity="1.00" d=" M 15.29 2.27 C 19.76 1.49 23.77 4.30 27.08 6.92 C 29.63 10.26 32.57 14.23 31.75 18.70 C 30.12 25.02 25.00 30.06 18.73 31.78 C 14.25 32.60 10.23 29.69 6.91 27.06 C 4.32 23.74 1.45 19.74 2.28 15.27 C 3.90 8.98 8.99 3.86 15.29 2.27 Z" />
                                </svg>
                            </div>

                            <div className="destinationContainer">
                                <svg viewBox="0 0 84 116" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#ffffff" opacity="1.00" d=" M 14.78 13.77 C 24.15 5.35 37.34 0.26 49.93 3.26 C 60.82 6.42 71.44 13.00 76.37 23.60 C 79.48 31.22 83.03 39.55 80.61 47.90 C 78.46 54.54 77.11 61.51 73.71 67.69 C 66.07 84.11 55.03 98.58 43.71 112.59 C 42.58 112.60 41.45 112.61 40.33 112.62 C 28.39 98.06 17.18 82.69 9.25 65.52 C 6.68 60.40 5.59 54.73 3.79 49.32 C 2.48 45.34 2.46 41.05 3.21 36.96 C 5.08 28.46 8.32 19.88 14.78 13.77 M 35.95 27.90 C 31.46 29.73 28.55 33.83 27.16 38.35 C 25.25 42.46 27.73 46.77 29.75 50.30 C 32.25 54.75 37.65 55.77 42.00 57.57 C 46.19 55.92 51.14 54.81 53.77 50.81 C 55.70 47.82 57.79 44.42 57.49 40.73 C 56.74 37.48 55.32 34.33 53.34 31.64 C 49.03 27.11 41.71 24.38 35.95 27.90 Z" />
                                </svg>
                            </div>

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
                                <label className="noselect">Startpunkt wählen</label>
                            </div>

                            <div className="group">
                                <input
                                    className="destinationInput"
                                    onSelect={(event) => this.onInputSelect(event)}
                                    onInput={() => this.updateContainer()}
                                    onKeyDown={(event) => this.onKeyDown(event)}
                                    ref={(input) => this.destinationInput = input}
                                    type="text" required/>
                                <label className="noselect">Zielort eingeben</label>
                            </div>
                        </div>

                        <div  className="rightContainer hover" onClick={() => this.onSwapClick()}>
                                <svg viewBox="0 0 110 120" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="rgba(255, 255, 255, 0.7)" opacity="1.00" d=" M 31.79 0.00 L 36.37 0.00 C 46.32 12.26 57.72 23.21 68.10 35.10 C 62.61 38.31 56.02 36.57 50.00 36.98 C 49.81 47.97 50.11 58.97 49.94 69.96 C 50.24 71.74 48.74 73.24 46.96 72.94 C 38.33 73.02 29.68 73.02 21.04 72.94 C 19.26 73.24 17.76 71.74 18.06 69.96 C 17.89 58.97 18.19 47.97 18.00 36.98 C 11.99 36.78 5.71 37.86 0.00 35.46 L 0.00 34.61 C 10.82 23.27 21.58 11.89 31.79 0.00 Z" />
                                    <path fill="rgba(255, 255, 255, 0.7)" opacity="1.00" d=" M 60.06 50.04 C 59.76 48.25 61.27 46.77 63.04 47.06 C 71.68 46.98 80.32 46.98 88.96 47.06 C 90.73 46.77 92.25 48.25 91.94 50.04 C 92.11 61.03 91.81 72.03 92.00 83.03 C 98.01 83.22 104.30 82.13 110.00 84.55 L 110.00 85.40 C 99.23 96.76 88.41 108.07 78.26 120.00 L 73.63 120.00 C 70.82 116.32 67.52 113.04 64.48 109.55 C 57.37 100.95 48.99 93.51 41.88 84.90 C 47.39 81.70 53.97 83.42 60.00 83.02 C 60.19 72.03 59.89 61.03 60.06 50.04 Z" />
                                </svg>
                        </div>

                    </div>

                </div>

                <AutoCompleteContainer
                    ref={(container) => this.container = container}
                    onRecommendationClick={(number) => this.onRecommendationClick(number)}/>
            </div>);
    }
}

export default NavigationSelector;