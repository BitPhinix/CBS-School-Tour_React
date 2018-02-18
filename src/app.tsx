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
    render() {
        if(!Cookies.get("cbs-main")){
            const cookie = new Cookie.CbsCookie;
            cookie.visited = true;
            Cookies.set("cbs-main", JSON.stringify(cookie))

            Toastr.info(
                "<div style='font-size: 12px'><div>Wir verwenden Cookies, um Inhalte und Anzeigen zu personalisieren und die Zugriffe auf unsere Website zu analysieren.</div>" +
                "<u><a href=\"./ppstatement.html\">Datenschutzerklärung</a></u><div></div>"
                , null, {
                    timeOut: 0,
                    closeOnHover: false
                }
            );
        }

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