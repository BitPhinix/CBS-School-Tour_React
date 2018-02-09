import * as React from "react";
import {ReactElement} from "react";
import {Point} from "../typings";

class SvgLoader extends React.Component<{}, {
    inlineElements: string,
    scale: number,
    translation: Point,
    overlay: ReactElement<SVGElement>[]
}>
{
    svg;
    mousePressed: boolean;
    lastMousePos = {} as Point;
    lastTouches: TouchList;
    mapContainer;

    lastUpdate: number = Date.now();

    targetState: {scale: number, translation: Point};

    constructor(props) {
        super(props);

        //Default state
        this.state = {inlineElements: "", scale: 1, translation: {x: 0, y: 0}, overlay: []};
        this.targetState = this.state;

        //Add event listener
        window.addEventListener("mouseup", () => this.mousePressed = false);
        window.addEventListener("mouseleave", () => this.mousePressed = false);
        window.addEventListener("mousemove", (event) => this.onMouseMove(event));

        //Prevent all multi-touch events
        window.document.addEventListener("touchstart", (event) => SvgLoader.onWindowTouch(event), false);
        window.requestAnimationFrame(() => this.update());
    }

    update() {
        window.requestAnimationFrame(() => this.update());

        const deltaTime = (Date.now() - this.lastUpdate) / 100;
        this.lastUpdate = Date.now();

        const deltaX = (this.targetState.translation.x - this.state.translation.x) * deltaTime;
        const deltaY = (this.targetState.translation.y - this.state.translation.y) * deltaTime;
        const scaleDelta = (this.targetState.scale - this.state.scale) * deltaTime;

        this.setState({
            scale: this.state.scale + scaleDelta,
            translation: {
                x: this.state.translation.x + deltaX,
                y: this.state.translation.y + deltaY
            }
        });
    }

    componentDidMount() {
        //Load default svg
        this.load("./svg/1.svg");
    }

    setOverlay(overlay: ReactElement<SVGElement>[]) {
        //If overlay is undefined
        if(!overlay)
            //Set overlay to an empty array
            this.setState({
                overlay: []
            });
        else
            //Set overlay to overlay
            this.setState({
                overlay
            });
    }

    static onWindowTouch(event){
        //If the the event is multi-touch
        if(event.touches.length > 1)
            //Prevent the default behavior
            event.preventDefault()
    }

    load(path: string) {
        //Crate new XMLHttpRequest
        const xmlRequest = new XMLHttpRequest();

        //This function will be called when call is complete
        xmlRequest.onload = () => {
            //Remove enclosing svg tags (just get content)
            const svgContent = xmlRequest.responseText.replace(new RegExp("<svg.*>|<\/svg.*>"), "");

            //Set inlineElements
            this.setState({inlineElements: svgContent});

            //Reset view
            this.resetView();
        };

        //Make call (async)
        xmlRequest.open("GET", path, true);
        xmlRequest.send(null);
    }

    moveSvg(deltaX: number, deltaY: number) {
        //Update state
        this.targetState.translation.x -= deltaX;
        this.targetState.translation.y -= deltaY;
    }


    resetView() {
        //Get mapContainer BoundingRect
        const boundingRect = this.mapContainer.getBoundingClientRect();

        //Zoom to the center of it
        this.zoomToPoint({
            x: boundingRect.width / 2,
            y: boundingRect.height / 2
        }, 1);
    }

    zoomToPoint(point: Point, scale: number) {
        console.log(point);

        //Move svg
        this.targetState.translation.x = this.svg.clientWidth / 2 - point.x;
        this.targetState.translation.y = this.svg.clientHeight / 2 - point.y;

        //Zoom to screen center
        this.zoomToScreenPoint({
            x: this.svg.clientWidth / 2,
            y: this.svg.clientHeight / 2
        }, scale - this.targetState.scale);
    }

    zoomToScreenPoint(point: Point, scaleDelta: number) {
        //Calculate new scale an constrain it
        const newScale = Math.min(Math.max(this.targetState.scale + scaleDelta, 0.7), 5);

        //This formula was 3h of work ^^
        const deltaX = (point.x / this.targetState.scale) * (1 - this.targetState.scale) - (point.x / newScale) * (1 - newScale);
        const deltaY = (point.y / this.targetState.scale) * (1 - this.targetState.scale) - (point.y / newScale) * (1 - newScale);

        //Update targetScale and move svg
        this.targetState.scale = newScale;
        this.moveSvg(deltaX, deltaY);
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
        this.zoomToScreenPoint({x: deltaX, y: deltaY}, -event.deltaY / 400);

        //Prevent default (otherwise entire page would zoom in)
        event.preventDefault();
    }

    onMouseMove(event) {
        //If mouse isn´t pressed
        if(!this.mousePressed)
            return;

        //Calculate movement deltas under consideration of the scale
        const deltaX = (this.lastMousePos.x - event.screenX) / this.targetState.scale;
        const deltaY = (this.lastMousePos.y - event.screenY) / this.targetState.scale;

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
            const deltaX = (this.lastTouches[0].screenX - event.touches[0].screenX) / this.targetState.scale;
            const deltaY = (this.lastTouches[0].screenY - event.touches[0].screenY) / this.targetState.scale;

            //Move svg
            this.moveSvg(deltaX, deltaY);
        }

        //Save current touch-state
        this.updateTouchState(event);
    }

    render() {
        return (
            <svg preserveAspectRatio="none" width="100%" height="100%"
                ref={(svg) => this.svg = svg}
                onWheel={(event) => this.onWheel(event)}
                onMouseDown={(event) => this.onMouseDown(event)}
                onTouchStart={(event) => this.updateTouchState(event)}
                onTouchMove={(event) => this.onTouchMove(event)}
                onTouchEnd={(event) => this.updateTouchState(event)}>
                <g transform={
                    "scale(" + this.state.scale + ") " +
                    "translate(" + this.state.translation.x + ", " + this.state.translation.y + ") "}>

                    <g dangerouslySetInnerHTML={{__html: this.state.inlineElements}}
                        ref={(container) => this.mapContainer = container}/>
                    <g>{this.state.overlay}</g>
                </g>
            </svg>
        );
    }
}

export default SvgLoader;