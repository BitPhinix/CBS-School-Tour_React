import * as React from "react";

class SvgLoader extends React.Component<{}, {inlineElements: string, scale: number, translation: {x: number, y: number}, rotation: number}> {

    svg;
    mousePressed: boolean;
    lastMouseXPos: number;
    lastMouseYPos: number;

    constructor(props) {
        super(props);

        //Default state
        this.state = {inlineElements: "", scale: 1, rotation: 0, translation: {x: 0, y: 0}};

        //Add event listener
        document.body.addEventListener("mouseup", () => this.mousePressed = false);
        document.body.addEventListener("mouseleave", () => this.mousePressed = false);
        document.body.addEventListener("mousemove", (event) => this.onMouseMove(event));
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

            //Remove enclosing svg tags (just get content)
            const svgContent = xmlRequest.responseText.replace(new RegExp("<svg.*>|<\/svg.*>"), "");

            //Set inlineElements
            this.setState({inlineElements: svgContent});
        };

        //Make call (async)
        xmlRequest.open("GET", path, true);
        xmlRequest.send(null);
    }

    moveSvg(deltaX: number, deltaY: number) {
        //Update state
        this.setState({translation: {
                x: this.state.translation.x - deltaX,
                y: this.state.translation.y - deltaY
            }});
    }

    zoomToScreenPoint(x: number, y: number, scaleDelta: number) {
        //Calculate new scale an constrain it
        const newScale = Math.min(Math.max(this.state.scale + scaleDelta, 0.7), 3);

        //This formula was 3h of work ^^
        let deltaX = (x / newScale) * (1 - newScale) - (x / this.state.scale) * (1 - this.state.scale);
        let deltaY = (y / newScale) * (1 - newScale) - (y / this.state.scale) * (1 - this.state.scale);

        //Update state (Don´t use moveSvg so we only re-render once)
        this.setState({
            scale: newScale,
            translation: {
                x: this.state.translation.x + deltaX,
                y: this.state.translation.y + deltaY
            }
        });
    }

    onWheel(event) {
        //Zoom to screen center
        this.zoomToScreenPoint(this.svg.clientWidth / 2, this.svg.clientHeight / 2, event.deltaY / 400);
    }

    onMouseMove(event) {
        //If mouse isn´t pressed
        if(!this.mousePressed)
            return;

        //Calculate movement deltas under consideration of the scale
        const deltaX = (this.lastMouseXPos - event.screenX) / this.state.scale;
        const deltaY = (this.lastMouseYPos - event.screenY) / this.state.scale;

        //Move SVG
        this.moveSvg(deltaX, deltaY);

        //Set lastMouseXPos, lastMouseYPos for delta calculations
        this.lastMouseXPos = event.screenX;
        this.lastMouseYPos = event.screenY;
    }

    onMouseDown(event) {
        //Set mousePressed to true
        this.mousePressed = true;

        //Set lastMouseXPos, lastMouseYPos for delta calculations
        this.lastMouseXPos = event.screenX;
        this.lastMouseYPos = event.screenY;
    }

    render() {
        return (
            <svg preserveAspectRatio="none" width="100%" height="100%" ref={(svg) => this.svg = svg}
                onWheel={(event) => this.onWheel(event)}
                onMouseDown={(event) => this.onMouseDown(event)}>
                <g transform={
                    "scale(" + this.state.scale + ") " +
                    "translate(" + this.state.translation.x + "," + this.state.translation.y + ") " +
                    "rotate(" + this.state.rotation + ")"}>

                    //Overlay
                    <g/>
                    //Svg contents
                    <g dangerouslySetInnerHTML={{__html: this.state.inlineElements}}/>
                </g>
            </svg>
        );
    }
}

export default SvgLoader;