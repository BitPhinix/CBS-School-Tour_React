import SvgBehaviourBase from "./iBehaviourBase";
import SvgRenderer from "../svgRenderer";
import {Point} from "../../../typings";

//TODO: Rewrite
class MoveToPointBehaviour implements SvgBehaviourBase {

	runInstant: boolean = false;
	blockUserInput: boolean = false;
	skipAble: boolean = true;

	private animationDuration: number;
	private timePassed: number = 0;
	private xDifference: number;
	private yDifference: number;
	private targetPoint: Point;

	constructor(targetPoint: Point, animationDuration?: number) {
		this.animationDuration = animationDuration;
		this.targetPoint = targetPoint;
	}

	initialize(svgRenderer: SvgRenderer) {
		if(!this.animationDuration)
			this.animationDuration = Math.sqrt(Math.pow(this.xDifference, 2) + Math.pow(this.yDifference, 2)) / 4;

		this.xDifference = svgRenderer.state.translation.x - this.targetPoint.x;
		this.yDifference = svgRenderer.state.translation.y - this.targetPoint.y;
	}

	onUserPan(xDifference: number, yDifference: number): void {}
	onUserZoom(zoomDifference: number, screenPoint: Point): void {}
	onUserPanStop(): void {}

	update(svgRenderer: SvgRenderer, deltaTime: number): boolean {
		if (deltaTime > this.animationDuration - this.timePassed)
			deltaTime = this.animationDuration - this.timePassed;

		this.timePassed += deltaTime;

		svgRenderer.setState({
			translation: {
				x: this.xDifference / this.animationDuration * deltaTime + svgRenderer.state.translation.x,
				y: this.yDifference / this.animationDuration * deltaTime + svgRenderer.state.translation.y
			}
		});

		return this.timePassed < this.animationDuration;
	}
}

export default MoveToPointBehaviour;