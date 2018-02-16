import "./app.css";
import * as React from "react";
import Map from "./components/map";
import NavigationSlider from "./components/navigationSlider";
import SearchBar from "./components/searchBar";
import FloorSelect from "./components/floorSelect";
import Untis from "./utils/untis";

class App extends React.Component<{}, {}> {
    render() {
        return(
            <div className="App" onClick={() => Untis.Login()}>
                <FloorSelect/>
                <SearchBar/>
                <NavigationSlider/>
                <Map/>
            </div>
        );
    }

}

export default App;