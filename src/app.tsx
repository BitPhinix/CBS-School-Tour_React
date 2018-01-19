import * as React from "react";
import Map from "./components/map";
import NavigationSlider from "./components/navigationSlider";
import SearchBar from "./components/searchBar";
const Style = require("./app.css");

class App extends React.Component<{}, {}> {
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