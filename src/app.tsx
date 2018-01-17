import * as React from "react";
import AutoCompleteContainer from "./components/autoCompleteContainer";
import Map from "./components/map";
import NavigationSlider from "./components/navigationSlider";
import SearchBar from "./components/searchBar";
const Style = require("./app.css");

class App extends React.Component<{}, {}> {

    private container: AutoCompleteContainer;

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="App" style={Style}>
                <SearchBar/>
                <NavigationSlider/>
                <Map/>
            </div>
        );
    }
}

export default App;