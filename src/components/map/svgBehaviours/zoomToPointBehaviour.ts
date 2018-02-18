import SvgBehaviourBase from "./iBehaviourBase";
import SvgRenderer from "../svgRenderer";
import {Point} from "../../../typings";

//TODO: Rewrite
class ZoomToPointBehaviour implements SvgBehaviourBase {
	
    blockUserInput: boolean = false;
    skipAble: boolean = false;
    
    point: Point;
    runInstant: boolean;
    isScreenPoint: boolean;
    animationDuration: number;

    private timePassed: number = 0;
    private scaleDifference: number;
    private xDifference: number;
    private yDifference: number;

    constructor(scaleDifference: number, point: Point, isScreenPoint: boolean, animationDuration?: number, runInstant: boolean = false) {
        this.scaleDifference = scaleDifference;
        this.point = point;
        this.runInstant = runInstant;
        this.animationDuration = animationDuration;
    }

    initialize(svgRenderer: SvgRenderer) {
        if(this.isScreenPoint) {
            this.xDifference = (svgRenderer.svg.clientWidth / 2 - this.point.x) - svgRenderer.state.translation.x;
            this.yDifference = (svgRenderer.svg.clientHeight / 2 - this.point.y) - svgRenderer.state.translation.y;
        }
        else {
            //TODO remove targetScale, simplify formula
            const targetScale = svgRenderer.state.scale + this.scaleDifference;
            this.xDifference = (this.point.x / svgRenderer.state.scale) * (1 - svgRenderer.state.scale) - (this.point.x / targetScale) * (1 - targetScale);
            this.yDifference = (this.point.y / svgRenderer.state.scale) * (1 - svgRenderer.state.scale) - (this.point.y / targetScale) * (1 - targetScale);
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
           scale: newScale,
           translation: {
               x: newX,
               y: newY
           }
        });

        return this.timePassed < this.animationDuration;
    }
}

export default ZoomToPointBehaviour;