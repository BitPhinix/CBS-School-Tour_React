import "./autoCompleteContainer.css";
import * as React from "react";
import autoComplete from "../utils/autoComplete";
import {Node} from "../typings";

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

        //For each autoComplete result
        for (let node of autoComplete.getResults(text)) {
            //Create new container item and add it to the result array
            items.push(new AutoCompleteContainerItem({
                node,
                onClick: this.onRecommendationClick
            }));
        }

        //Add items, set visible to false
        this.setState({
           items, visible: true
        });
    }

    setVisibility(visible: boolean) {
        //Set state to visible
        this.setState({visible});
    }

    onRecommendationClick(node: Node) {
        //if onRecommendationClick is defined
        if(this.props.onRecommendationClick)
            //Call onRecommendationClick
            this.props.onRecommendationClick(node.number);
    }

    render() {
        let renderedItems;

        //If container is visible
        if(this.state.visible) {
            //For each element map rendered element
            renderedItems = this.state.items.map(function (element) {
                //Render element
                return element.render();
            });
        }

        return(
            <div className="autoCompleteContainer">
                <ul className="autoCompleteList">
                    {renderedItems}
                </ul>
            </div>
        );
    }
}

class AutoCompleteContainerItem extends React.Component<{node: Node, onClick?: (node: Node) => any}, {}> {

    onClick() {
        //If onClick is defined
        if(this.props.onClick)
            //Call onClick
            this.props.onClick(this.props.node);
    }

    render() {
        return(
            <li key={this.props.node.number} className="autoCompleteContainerItem" onClick={() => this.onClick()}>

                <svg viewBox="0 0 84 115" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#A7A7A7" opacity="1.00" d=" M 14.78 13.77 C 24.15 5.35 37.34 0.26 49.93 3.26 C 60.82 6.42 71.44 13.00 76.37 23.60 C 79.48 31.22 83.03 39.55 80.61 47.90 C 78.46 54.54 77.11 61.51 73.71 67.69 C 66.07 84.11 55.03 98.58 43.71 112.59 C 42.58 112.60 41.45 112.61 40.33 112.62 C 28.39 98.06 17.18 82.69 9.25 65.52 C 6.68 60.40 5.59 54.73 3.79 49.32 C 2.48 45.34 2.46 41.05 3.21 36.96 C 5.08 28.46 8.32 19.88 14.78 13.77 M 35.95 27.90 C 31.46 29.73 28.55 33.83 27.16 38.35 C 25.25 42.46 27.73 46.77 29.75 50.30 C 32.25 54.75 37.65 55.77 42.00 57.57 C 46.19 55.92 51.14 54.81 53.77 50.81 C 55.70 47.82 57.79 44.42 57.49 40.73 C 56.74 37.48 55.32 34.33 53.34 31.64 C 49.03 27.11 41.71 24.38 35.95 27.90 Z" />
                </svg>

                <div className="textContainer">
                    <p>{"Raum " + this.props.node.number}</p>
                    <small>{this.props.node.description}</small>
                </div>
            </li>
        );
    }
}

export default AutoCompleteContainer;