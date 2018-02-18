import IBehaviourBase from "./iBehaviourBase";
import SvgRenderer from "../svgRenderer";
import {Point} from "../../../typings";

//TODO: Stop at low speeds
class UserPanBehaviour implements IBehaviourBase {

	runInstant: boolean = false;
	blockUserInput: boolean = false;
	skipAble: boolean = true;

	private xDifference: number;
	private yDifference: number;
	private xVelocity: number = 0;
	private yVelocity: number = 0;
	private isPanning: boolean = true;

	constructor(xDifference: number, yDifference: number) {
		this.updateDifferences(xDifference, yDifference);
	}

	initialize(svgRenderer: SvgRenderer) {}
	onUserZoom(zoomDifference: number, screenPoint: Point): void {}

	onUserPanStop(): void {
		this.isPanning = false;
	}

	onUserPan(xDifference: number, yDifference: number): void {
		this.isPanning = true;
		this.updateDifferences(xDifference, yDifference);
	}

	private updateDifferences(xDifference: number, yDifference: number) {
		this.xDifference = xDifference;
		this.yDifference = yDifference;
		this.xVelocity += xDifference;
		this.yVelocity += yDifference;
	}

	update(svgRenderer: SvgRenderer, deltaTime: number): boolean {
		svgRenderer.setState({
			translation: {
				x: svgRenderer.state.translation.x + (this.isPanning ? this.xDifference : this.xVelocity * deltaTime / 10) / svgRenderer.state.scale,
				y: svgRenderer.state.translation.y + (this.isPanning ? this.yDifference : this.yVelocity * deltaTime / 10) / svgRenderer.state.scale
			}
		});

		this.xDifference = 0;
		this.yDifference = 0;

		this.xVelocity *= 0.6;
		this.yVelocity *= 0.6;

		//TODO
		return true;
	}
}

export default UserPanBehaviour;