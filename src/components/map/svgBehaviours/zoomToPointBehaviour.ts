import SvgBehaviourBase from "./iBehaviourBase";
import SvgRenderer from "../svgRenderer";
import {Point} from "../../../typings";

class ZoomToPointBehaviour implements SvgBehaviourBase {
	
    blockUserInput: boolean = true;
    skipAble: boolean = false;
	runInstant: boolean = true;

    point: Point;
    isScreenPoint: boolean;
    animationDuration: number;

    private timePassed: number = 0;
    private targetScale: number;
    private scaleDifference: number;
    private xDifference: number;
    private yDifference: number;

    constructor(targetScale: number, point: Point, isScreenPoint: boolean, animationDuration?: number) {
        this.targetScale = targetScale;
        this.point = point;
        this.animationDuration = animationDuration;
    }

    initialize(svgRenderer: SvgRenderer) {
        if(!this.isScreenPoint) {
            this.xDifference = (svgRenderer.svg.clientWidth / 2 - this.point.x) - svgRenderer.state.translation.x;
            this.yDifference = (svgRenderer.svg.clientHeight / 2 - this.point.y) - svgRenderer.state.translation.y;
        }
        else {
            this.xDifference = (this.point.x / svgRenderer.state.scale) * (1 - svgRenderer.state.scale) - (this.point.x / this.targetScale) * (1 - this.targetScale);
            this.yDifference = (this.point.y / svgRenderer.state.scale) * (1 - svgRenderer.state.scale) - (this.point.y / this.targetScale) * (1 - this.targetScale);
        }

		if(!this.animationDuration)
            this.animationDuration = Math.abs(this.scaleDifference) * 1000;
    }

	onUserPan(xDifference: number, yDifference: number): void {}
	onUserZoom(zoomDifference: number, screenPoint: Point): void {}
	onUserPanStop(): void {}

    update(svgRenderer: SvgRenderer, deltaTime: number): boolean {
        if(deltaTime > this.animationDuration - this.timePassed)
            deltaTime = this.animationDuration - this.timePassed;

        this.timePassed += deltaTime;

        const newX = this.xDifference / this.animationDuration * deltaTime + svgRenderer.state.translation.x;
        const newY = this.yDifference / this.animationDuration * deltaTime + svgRenderer.state.translation.y;

		const newScale = this.scaleDifference / this.animationDuration * deltaTime + svgRenderer.state.scale;

		svgRenderer.setState({
           scale: newScale ? newScale : svgRenderer.state.scale,
           translation: {
               x: newX ? newX : svgRenderer.state.translation.x,
               y: newY ? newY : svgRenderer.state.translation.y
           }
        });

        return this.timePassed < this.animationDuration;
    }
}

export default ZoomToPointBehaviour;