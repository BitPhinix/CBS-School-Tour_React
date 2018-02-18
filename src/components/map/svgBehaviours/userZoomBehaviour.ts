import IBehaviourBase from "./iBehaviourBase";
import SvgRenderer from "../svgRenderer";
import {Point} from "../../../typings";

//TODO: Stop at low speeds
class UserZoomBehaviour implements IBehaviourBase {

	runInstant: boolean = false;
	blockUserInput: boolean = false;
	skipAble: boolean = true;

	private zoomSpeed: number;
	private zoomPoint: Point;

	constructor(zoomDifference: number, screenPoint: Point) {
		this.zoomSpeed = zoomDifference;
		this.zoomPoint = screenPoint;
	}

	initialize(svgRenderer: SvgRenderer) {}
	onUserPan(xDifference: number, yDifference: number): void {}
	onUserPanStop(): void {}

	onUserZoom(zoomDifference: number, screenPoint: Point): void {
		this.zoomSpeed = zoomDifference;
		this.zoomPoint = screenPoint;
	}

	update(svgRenderer: SvgRenderer, deltaTime: number): boolean {
		svgRenderer.setState({
			scale: svgRenderer.state.scale + this.zoomSpeed * svgRenderer.state.scale * deltaTime / 50
		});

		//TODO: Use delta time in speed update
		this.zoomSpeed *= 0.8;

		return Math.abs(this.zoomSpeed) > 0.001;
	}
}

export default UserZoomBehaviour;