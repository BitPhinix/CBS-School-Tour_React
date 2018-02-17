import SvgActionBase from "./svgActionBase";
import NewSvgRenderer from "../components/svgRenderer";

class MoveSvgAction implements SvgActionBase {
	runInstant: boolean = false;
	blockUserInput: boolean = false;
	skipAble: boolean = true;

	private animationDuration: number;
	private timePassed: number = 0;
	private xDifference: number;
	private yDifference: number;
	private considerScale: boolean;

	constructor(xDifference: number, yDifference: number, considerScale: boolean = false, animationDuration?: number) {
		this.xDifference = xDifference;
		this.yDifference = yDifference;
		this.animationDuration = animationDuration;
		this.considerScale = considerScale;
	}

	initialize(svgRenderer: NewSvgRenderer) {
		if(!this.animationDuration)
			this.animationDuration = Math.sqrt(Math.pow(this.xDifference, 2) + Math.pow(this.yDifference, 2)) / 4;
	}

	update(svgRenderer: NewSvgRenderer, deltaTime: number): boolean {
		if (deltaTime > this.animationDuration - this.timePassed)
			deltaTime = this.animationDuration - this.timePassed;

		this.timePassed += deltaTime;

		svgRenderer.setState({
			translation: {
				x: (this.xDifference / this.animationDuration * deltaTime) / (this.considerScale ? svgRenderer.state.scale : 1) + svgRenderer.state.translation.x,
				y: (this.yDifference / this.animationDuration * deltaTime) / (this.considerScale ? svgRenderer.state.scale : 1) + svgRenderer.state.translation.y
			}
		});

		return this.timePassed < this.animationDuration;
	}
}

export default MoveSvgAction;