import * as React from "react";

class SvgLoader extends React.Component<{}, {htmlString: string}> {

    constructor(props) {
        super(props);

        //Default state
        this.state = {htmlString: ""};
    }

    componentDidMount() {
        //Load default svg
        this.load("./svg/1.svg");
    }

    load(path: string) {
        //Crate new XMLHttpRequest
        const xmlRequest = new XMLHttpRequest();

        //THis function will be called when call is complete
        xmlRequest.onreadystatechange = () => {
            //Set htmlString
            this.setState({htmlString: xmlRequest.responseText});
        };

        //Make call (async)
        xmlRequest.open("GET", path, true);
        xmlRequest.send(null);
    }

    render() {
        return (
            <div dangerouslySetInnerHTML={{__html: this.state.htmlString}}/>
        );
    }
}

export default SvgLoader;