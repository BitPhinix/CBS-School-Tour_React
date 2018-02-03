import "./app.css";
import * as React from "react";
import Map from "./components/map";
import NavigationSlider from "./components/navigationSlider";
import SearchBar from "./components/searchBar";
import FloorSelect from "./components/floorSelect";

class App extends React.Component<{}, {}> {
    render() {
        return(
            <div className="App">
                <FloorSelect/>
                <SearchBar/>
                <NavigationSlider/>
                <Map/>
            </div>
        );
    }

}

export default App;