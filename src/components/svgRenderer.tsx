import * as React from "react";

class SvgLoader extends React.Component<{}, {
    inlineElements: string,
    scale: number,
    translation: Point,
    rotation: number,
    overlay: SVGElement[]
}>
{
    svg;
    mousePressed: boolean;
    lastMousePos = {} as Point;
    lastTouches: TouchList;

    constructor(props) {
        super(props);

        //Default state
        this.state = {inlineElements: "", scale: 1, rotation: 0, translation: {x: 0, y: 0}, overlay: []};

        //Add event listener
        document.body.addEventListener("mouseup", () => this.mousePressed = false);
        document.body.addEventListener("mouseleave", () => this.mousePressed = false);
        document.body.addEventListener("mousemove", (event) => this.onMouseMove(event));

        //Prevent all multi-touch events
        window.addEventListener("touchstart", (event) => SvgLoader.onWindowTouch(event), false);
    }

    static onWindowTouch(event){
        //If the the event is multi-touch
        if(event.touches.length > 1)
            //Prevent the default behavior
            event.preventDefault()
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

    zoomToScreenPoint(point: Point, scaleDelta: number) {
        //Calculate new scale an constrain it
        const newScale = Math.min(Math.max(this.state.scale + scaleDelta, 0.7), 5);

        //This formula was 3h of work ^^
        const deltaX = (point.x / newScale) * (1 - newScale) - (point.x / this.state.scale) * (1 - this.state.scale);
        const deltaY = (point.y / newScale) * (1 - newScale) - (point.y / this.state.scale) * (1 - this.state.scale);

        //Update state (Don´t use moveSvg so we only re-render once)
        this.setState({
            scale: newScale,
            translation: {
                x: this.state.translation.x + deltaX,
                y: this.state.translation.y + deltaY
            }
        });
    }

    static getDistance(touch1: Touch, touch2: Touch) {
        //Calculate and return the distance between the tow points
        return Math.sqrt(Math.pow(touch1.screenX - touch2.screenX, 2) + Math.pow(touch1.screenY - touch2.screenY, 2));
    }

    updateTouchState(event) {
        //Save current touch-state as lastTouches
        this.lastTouches = event.touches;
    }

    onWheel(event) {
        //Calculate mouse position relative to element
        const deltaX = event.pageX - this.svg.getBoundingClientRect().left;
        const deltaY = event.pageY - this.svg.getBoundingClientRect().top;

        //Zoom to mouse position
        this.zoomToScreenPoint({x: deltaX, y: deltaY}, event.deltaY / 400);
    }

    onMouseMove(event) {
        //If mouse isn´t pressed
        if(!this.mousePressed)
            return;

        //Calculate movement deltas under consideration of the scale
        const deltaX = (this.lastMousePos.x - event.screenX) / this.state.scale;
        const deltaY = (this.lastMousePos.y - event.screenY) / this.state.scale;

        //Move SVG
        this.moveSvg(deltaX, deltaY);

        //Set lastMouseXPos, lastMouseYPos for delta calculations
        this.lastMousePos.x = event.screenX;
        this.lastMousePos.y = event.screenY;
    }

    onMouseDown(event) {
        //Set mousePressed to true
        this.mousePressed = true;

        //Set lastMouseXPos, lastMouseYPos for delta calculations
        this.lastMousePos.x = event.screenX;
        this.lastMousePos.y = event.screenY;
    }

    //lastTouches.length will always equal event.touches.length when this function is called !!
    onTouchMove(event) {
        //Pinch (2 finger input)
        if(this.lastTouches.length == 2) {
            //Calculate the distance between the old touches and the the distance between the new ones
            const oldDistance = SvgLoader.getDistance(this.lastTouches[0], this.lastTouches[1]);
            const newDistance = SvgLoader.getDistance(event.touches[0], event.touches[1]);

            //Get the center-point of the tow touches
            const x = (event.touches[0].screenX + event.touches[1].screenX) / 2;
            const y = (event.touches[0].screenY + event.touches[1].screenY) / 2;

            //Zoom to the center-point
            this.zoomToScreenPoint({x, y}, (newDistance - oldDistance) / 300);
        }

        //Pan (1 finger input)
        else if(this.lastTouches.length == 1) {
            //Calculate the difference between the old and the new input
            const deltaX = (this.lastTouches[0].screenX - event.touches[0].screenX) / this.state.scale;
            const deltaY = (this.lastTouches[0].screenY - event.touches[0].screenY) / this.state.scale;

            //Move svg
            this.moveSvg(deltaX, deltaY);
        }

        //Save current touch-state
        this.updateTouchState(event);
    }

    render() {
        return (
            <svg preserveAspectRatio="none" width="100%" height="100%" ref={(svg) => this.svg = svg}
                onWheel={(event) => this.onWheel(event)}
                onMouseDown={(event) => this.onMouseDown(event)}
                onTouchStart={(event) => this.updateTouchState(event)}
                onTouchMove={(event) => this.onTouchMove(event)}
                onTouchEnd={(event) => this.updateTouchState(event)}>
                <g transform={
                    "scale(" + this.state.scale + ") " +
                    "translate(" + this.state.translation.x + "," + this.state.translation.y + ") " +
                    "rotate(" + this.state.rotation + ")"}>

                    //Overlay
                    <g>{this.state.overlay}</g>
                    //Svg contents
                    <g dangerouslySetInnerHTML={{__html: this.state.inlineElements}}/>
                </g>
            </svg>
        );
    }
}

interface Point {
    x: number,
    y: number
}

export default SvgLoader;