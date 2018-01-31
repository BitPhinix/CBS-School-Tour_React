import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import AutoCompleteContainer from "./autoCompleteContainer";
import * as Toastr from "toastr";
import * as SliderActions from "../actions/sliderActions";
import autoComplete from "../utils/autoComplete";
const Style = require("./searchBar.css");

class SearchBar extends React.Component<{}, {value: string}> {
    input;
    container;

    constructor(props) {
        super(props);

        //Hide container on window click
        window.addEventListener("click", () => this.container.setVisibility(false));
    }

    onRecommendationClick(number: number) {
        //Update input value
        this.input.value = "Raum " + number;

        //Zoom to recommendation
        this.zoomToTarget();
    }

    onKeyDown(event) {
        //If key is enter
        if(event.keyCode === 13)
            //Zoom to target
            this.zoomToTarget();
    }

    zoomToTarget() {
        //Try to get target
        const target = autoComplete.getRoom(this.input.value);

        //If no target was found
        if(!target)
            //Alert
            Toastr.error("Ort konnte nicht gefunden werden oder ist nicht eindeutig!");
        else
            //TODO zoom to target
            return;
    }

    render() {
        return (
            <div className="searchBar" style={Style}>
                <div className="searchBarContainer">

                    <div className="inputContainer">
                        <input type="text"
                               placeholder="In CBS Mannheim suchen"

                            //Stop event propagation, Show container when clicked
                               onClick={(event) => {event.stopPropagation(); this.container.setVisibility(true)}}
                               onInput={() => this.container.update(this.input.value)}
                               onKeyDown={(event) => this.onKeyDown(event)}
                               ref={(input) => this.input = input}/>
                    </div>

                    <div className="interactContainer">
                        <div className="searchContainer iconContainer" onClick={() => this.zoomToTarget()}>
                            <svg xmlns="http://www.w3.org/2000/svg">
                                <path id="search" fill="#B0B0B0" d="M9 18c-4.962 0-9-4.037-9-9 0-4.962 4.038-9 9-9 4.963 0 9 4.038 9 9 0 4.963-4.037 9-9 9zm0-16c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zM23 24c-.256 0-.512-.098-.707-.293l-8-8c-.391-.391-.391-1.023 0-1.414s1.023-.391 1.414 0l8 8c.391.391.391 1.023 0 1.414-.195.195-.451.293-.707.293z"/>
                            </svg>
                        </div>

                        <div className="barContainer">
                            <svg xmlns="http://www.w3.org/2000/svg">
                                <rect/>
                            </svg>
                        </div>

                        <div className="navigationContainer iconContainer"
                            //Show navigation slider
                             onClick={() => SliderActions.showNavigation()}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"
                                 enable-background="new 0 0 32 32">
                                <path id="navigate" fill="#69A6F5" d="M31.411,14.601L17.396,0.589c-0.774-0.775-2.028-0.775-2.802,0L0.578,14.601c-0.771,0.776-0.771,2.03,0,2.805l14.016,14.012  c0.774,0.776,2.028,0.776,2.802,0l14.016-14.012C32.185,16.631,32.185,15.377,31.411,14.601z M18,20.022V16h-4v4.022  c0,1.105-0.895,2.001-2,2.001c-1.106,0-2-0.896-2-2.001c0,0,0-5.701,0-6.001C10,12.915,10.905,12,12.011,12C12.312,12,18,12,18,12  V8.02l6.002,6.001L18,20.022z"/>
                            </svg>
                        </div>
                    </div>

                </div>
                <AutoCompleteContainer
                    onRecommendationClick={(number) => this.onRecommendationClick(number)}
                    ref={(container) => this.container = container}/>
            </div>
        );
    }
}

export default SearchBar;