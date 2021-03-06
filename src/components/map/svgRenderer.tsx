import * as React from "react";
import {Point} from "../../typings";
import {ReactElement} from "react";
import BehaviourBase from "./svgBehaviours/iBehaviourBase";
import UserZoomBehaviour from "./svgBehaviours/userZoomBehaviour";
import UserPanBehaviour from "./svgBehaviours/userPanBehaviour";

class NewSvgRenderer extends React.Component<{}, {
    inlineElements: string,
    scale: number,
    translation: Point,
    overlay: ReactElement<SVGElement>[]
}> {
    svg: SVGSVGElement;
    mapContainer;

    private lastUpdate: number = Date.now();
    private behaviourQue: BehaviourBase[] = [];
    private currentBehaviour: BehaviourBase;
	private mousePressed: boolean;
	private lastMousePos: Point;
	private lastTouches: TouchList;

    constructor(props) {
    	super(props);

		//Default state
		this.state = {inlineElements: "", scale: 1, translation: {x: 0, y: 0}, overlay: []};

		//Add event listener
		window.addEventListener("mouseup", () => this.onMouseUp());
		window.addEventListener("mouseleave", () => this.onMouseUp());
		window.addEventListener("mousemove", (event) => this.onMouseMove(event));

		//Prevent all multi-touch events
		window.document.addEventListener("touchstart", (event) => this.onWindowTouch(event), false);

		//Request a AnimationFrame
		window.requestAnimationFrame(() => this.update());
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

	processBehaviour(action: BehaviourBase) {
		//If action need to be run instantly
    	if(action.runInstant) {
			//Clear que
			this.behaviourQue = [];

			//Clear currentBehaviour
			this.currentBehaviour = null;
		}


    	//Add action to que
		this.behaviourQue.push(action);
    }

    private update() {
		//Get current time
        const currentTime = Date.now();

        //Calculate deltaTime
        const deltaTime = currentTime - this.lastUpdate;

        //Update lastUpdate
        this.lastUpdate = currentTime;

        //If currentAction is undefined or currentAction.update() returns false or currentAction is skip-able and the que isn´t empty
        if(!this.currentBehaviour || !this.currentBehaviour.update(this, deltaTime) || this.currentBehaviour.skipAble && this.behaviourQue.length > 0)
            //Get next action from que
            this.currentBehaviour = this.getNextAction();

		//Request a new AnimationFrame
        window.requestAnimationFrame(() => this.update());
    }

    private getNextAction() {
        //If que is empty
        if(this.behaviourQue.length == 0)
            //Return nothing
            return;

        //Get next element in que
        const nextElement = this.behaviourQue.pop();

        //Call initialize
        nextElement.initialize(this);

        //return nextElement
        return nextElement;
    }

    private processUserZoom(zoomDifference: number, screenPoint: Point) {
    	if(this.currentBehaviour && this.currentBehaviour.blockUserInput)
    		return;

    	if(!(this.currentBehaviour instanceof UserZoomBehaviour))
    		this.processBehaviour(new UserZoomBehaviour(zoomDifference, screenPoint));
    	else if(this.currentBehaviour)
    		this.currentBehaviour.onUserZoom(zoomDifference, screenPoint);
	}

	private processUserPan(xDifference: number, yDifference: number) {
		if(this.currentBehaviour && this.currentBehaviour.blockUserInput)
			return;

		if(!(this.currentBehaviour instanceof UserPanBehaviour))
			this.processBehaviour(new UserPanBehaviour(xDifference, yDifference));
		else if(this.currentBehaviour)
			this.currentBehaviour.onUserPan(xDifference, yDifference);
	}

	private processUserPanStop() {
		if(this.currentBehaviour && this.currentBehaviour.blockUserInput)
			return;

		if(this.currentBehaviour)
			this.currentBehaviour.onUserPanStop();
	}

	//region EventHandlers
	private onMouseUp() {
    	if(this.mousePressed)
			this.processUserPanStop();

    	this.mousePressed = false;
	}

	private onWheel(event) {
    	this.processUserZoom(event.deltaY / -400, {
			x: event.pageX - this.svg.getBoundingClientRect().left,
			y: event.pageY - this.svg.getBoundingClientRect().top
		});
	}

	private onMouseDown(event) {
		//Set mousePressed to true
		this.mousePressed = true;

		//Set lastMouse for delta calculations
		this.lastMousePos = {
			x: event.screenX,
			y: event.screenY
		};
	}

	private updateTouchState(event) {
    	if(this.lastTouches.length == 1 && event.touches.length != 1)
    		this.processUserPanStop();

		//Save current touch-state as lastTouches
		this.lastTouches = event.touches;
	}

	private onTouchMove(event) {
		//Pinch (2 finger input)
		if(this.lastTouches.length == 2) {
			//Calculate the distance between the old touches and the the distance between the new ones
			const oldDistance = this.getDistance(this.lastTouches[0], this.lastTouches[1]);
			const newDistance = this.getDistance(event.touches[0], event.touches[1]);

			//Zoom to the center-point
			this.processUserZoom((newDistance - oldDistance) / 300, {
				x: (event.touches[0].screenX + event.touches[1].screenX) / 2,
				y: (event.touches[0].screenY + event.touches[1].screenY) / 2
			});
		}

		//Pan (1 finger input)
		else if(this.lastTouches.length == 1)
			//Calculate the difference between the old and the new input and move appropriately
			this.processUserPan(this.lastTouches[0].screenX - event.touches[0].screenX, this.lastTouches[0].screenY - event.touches[0].screenY);

		//Save current touch-state
		this.updateTouchState(event);
	}

	private onMouseMove(event) {
		//If mouse isn´t pressed
		if(!this.mousePressed)
			return;

		//Calculate movement deltas under consideration of the scale and move appropriately
		this.processUserPan(event.screenX - this.lastMousePos.x, event.screenY - this.lastMousePos.y);

		//Set lastMouseXPos, lastMouseYPos for delta calculations
		this.lastMousePos.x = event.screenX;
		this.lastMousePos.y = event.screenY;
	}

	private onWindowTouch(event) {
		//If the the event is multi-touch
		if(event.touches.length > 1)
			//Prevent the default behavior
			event.preventDefault()
	}
	//endregion

	getDistance(touch1: Touch, touch2: Touch) {
		//Calculate and return the distance between the tow points
		return Math.sqrt(Math.pow(touch1.screenX - touch2.screenX, 2) + Math.pow(touch1.screenY - touch2.screenY, 2));
	}

    render() {
        return (
            <svg ref={(svg) => this.svg = svg} preserveAspectRatio="none" width="100%" height="100%"
				 onWheel={(event) => this.onWheel(event)}
				 onMouseDown={(event) => this.onMouseDown(event)}
				 onTouchStart={(event) => this.updateTouchState(event)}
				 onTouchMove={(event) => this.onTouchMove(event)}
				 onTouchEnd={(event) => this.updateTouchState(event)}>
                <g transform={
                    "scale(" + this.state.scale + ") " +
                    "translate(" + this.state.translation.x + ", " + this.state.translation.y + ") "}
					ref={(mapContainer) => this.mapContainer = mapContainer}>
                    <g dangerouslySetInnerHTML={{__html: this.state.inlineElements}}/>
                    <g>{this.state.overlay}</g>
                </g>
            </svg>
        );
    }
}

export default NewSvgRenderer;