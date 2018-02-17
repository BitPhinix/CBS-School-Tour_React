import "./app.css";
import * as React from "react";
import Map from "./components/map";
import NavigationSlider from "./components/navigationSlider";
import SearchBar from "./components/searchBar";
import FloorSelect from "./components/floorSelect";
import Untis from "./utils/untis";
import * as Toastr from "toastr";

const cookieOptions = {
    timeOut: 0
}

class App extends React.Component<{}, {}> {
    render() {
        Toastr.info(
            "<div>Wir verwenden Cookies, um Inhalte und Anzeigen zu personalisieren und die Zugriffe auf unsere Website zu analysieren.</div>" +
            "<u><a href=\"./ppstatement.html\">Datenschutzerklärung</a></u>"
            , null, cookieOptions
        );

        return(
            <div className="App" onClick={() => Untis.login()}>
                <FloorSelect/>
                <SearchBar/>
                <NavigationSlider/>
                <Map/>
            </div>
        );
    }
}

export default App;