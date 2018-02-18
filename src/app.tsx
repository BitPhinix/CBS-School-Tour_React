import "./app.css";
import * as React from "react";
import Map from "./components/map/map";
import NavigationSlider from "./components/navigationSlider";
import SearchBar from "./components/searchBar";
import FloorSelect from "./components/floorSelect";
import Untis from "./utils/untis";
import * as Toastr from "toastr";
import * as Cookies from 'es-cookie';
import * as Cookie from "./utils/cookie";


class App extends React.Component<{}, {}> {

    componentDidMount() {
        //If cookie "cbs-main" doesn't exist
        if(!Cookies.get("cbs-main")){
            //Create cookie "cbs-main" and set "visited" to true
            Cookies.set("cbs-main", JSON.stringify({visited: true}), { expires: 30})

            //Show privacy policy statement in toast if it's the first time visiting the website
            Toastr.info(
                "<div style='font-size: 12px'><div>Wir verwenden Cookies, um Inhalte und Anzeigen zu personalisieren und die Zugriffe auf unsere Website zu analysieren.</div>" +
                "<u><a href=\"./ppstatement.html\">Datenschutzerklärung</a></u><div></div>"
                , null, {
                    timeOut: 15000,
                    closeOnHover: false
                }
            );
        }
    }

    render() {
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