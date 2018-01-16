import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import AutoCompleteContainer from "./autoCompleteContainer";
import navigationStore from "../stores/navigationStore";
import * as SliderActions from "../actions/sliderActions";
import {ClassRoom} from "../typings";
const Style = require("./searchBar.css");

class SearchBar extends React.Component<{}, {value: string}> {

    input;
    container;

    constructor(props) {
        super(props);
        document.addEventListener("click", () => this.hideContainer());
    }

    componentDidMount() {

    }

    showContainer() {
        this.container.setVisibility(true);
    }

    hideContainer() {
        this.container.setVisibility(false);
    }

    onRecommendationClick(number: number) {
        this.input.value = "Raum " + number;
    }

    render() {
        return (
            <div className="searchBar" style={Style}>
                <div className="inputContainer">
                    <input type="text"
                           placeholder="In CBS Mannheim suchen"

                           //Show container when clicked
                           onClick={(event) => {event.stopPropagation(); this.showContainer()}}

                           //Update container on input
                           onInput={() => this.container.update(this.input.value)}

                           //Add ref to input
                           ref={(input) => this.input = input}/>
                    <div className="iconContainer">
                        <FontAwesome className="searchIcon" name="search"/>
                        <FontAwesome className="navigationIcon" name="location-arrow"
                                     //Show navigation slider
                                     onClick={() => SliderActions.showNavigation()}/>
                    </div>
                </div>
                <AutoCompleteContainer
                    //Call onRecommendationClick on recommendation click ^^
                    onRecommendationClick={(number) => this.onRecommendationClick(number)}

                    //Add ref to container
                    ref={(container) => this.container = container}/>
            </div>
        );
    }
}

export default SearchBar;