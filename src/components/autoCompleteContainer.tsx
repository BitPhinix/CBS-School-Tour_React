import * as React from "react";
import "./autoCompleteContainer.css";
import NavigationHelper from "../utils/navigationHelper";
import {ClassRoom} from "../typings";
import * as FontAwesome from "react-fontawesome";
const Style = require("./autoCompleteContainer.css");

class AutoCompleteContainer extends React.Component<{onRecommendationClick?: (roomNumber: number) => any}, {items: AutoCompleteContainerItem[], visible: boolean}> {

    constructor(props) {
        super(props);

        //Default state
        this.state = {items: [], visible: false};

        //Bind onRecommendationClick to element
        this.onRecommendationClick = this.onRecommendationClick.bind(this);
    }

    update(text: string) {
        const items = [];

        for (let room of NavigationHelper.getResults(text)) {
            items.push(new AutoCompleteContainerItem({
                room: room,
                onClick: this.onRecommendationClick
            }));
        }

        this.setState({
           items, visible: true
        });
    }

    setVisibility(visible: boolean) {
        this.setState({visible});
    }

    onRecommendationClick(room: ClassRoom) {
        if(this.props.onRecommendationClick)
            this.props.onRecommendationClick(room.number);
    }

    render() {
        let renderedItems;

        if(this.state.visible)
            renderedItems = this.state.items.map(function (element) {
                return element.render();
            });

        return(
            <ul className="autoCompleteContainer" style={Style}>
                {renderedItems}
            </ul>
        );
    }
}

class AutoCompleteContainerItem extends React.Component<{
    room: ClassRoom,
    onClick?: (roomNumber: ClassRoom) => any,
}, {}> {

    onClick() {
        if(this.props.onClick)
            this.props.onClick(this.props.room);
    }

    render() {
        return(
            <li key={this.props.room.number} className="autoCompleteContainerItem" onClick={() => this.onClick()} style={Style}>
                <FontAwesome name="map-marker"/>
                <div>
                    <p>{"Raum " + this.props.room.number}</p>
                    <small>{this.props.room.description}</small>
                </div>
            </li>
        );
    }
}

export default AutoCompleteContainer;