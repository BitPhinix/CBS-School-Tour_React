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
                <div className="inputContainer">
                    <input type="text"
                           placeholder="In CBS Mannheim suchen"

                           //Stop event propagation, Show container when clicked
                           onClick={(event) => {event.stopPropagation(); this.container.update(this.input.value)}}
                           onInput={() => this.container.update(this.input.value)}
                           onKeyDown={(event) => this.onKeyDown(event)}
                           ref={(input) => this.input = input}/>
                    <div className="iconContainer">
                        <FontAwesome className="searchIcon" name="search"
                            onClick={() => this.zoomToTarget()}/>
                        <FontAwesome className="navigationIcon" name="location-arrow"
                            //Show navigation slider
                            onClick={() => SliderActions.showNavigation()}/>
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