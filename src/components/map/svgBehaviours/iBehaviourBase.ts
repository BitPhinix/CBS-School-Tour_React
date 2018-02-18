import SvgRenderer from "../svgRenderer";
import {Point} from "../../../typings";

interface IBehaviourBase {
    initialize(svgRenderer: SvgRenderer): void;
    update(svgRenderer: SvgRenderer, deltaTime: number): boolean;

	onUserPan(xDifference: number, yDifference: number): void;
	onUserZoom(zoomDifference: number, screenPoint: Point): void;
	onUserPanStop(): void;

    readonly runInstant: boolean;
    readonly blockUserInput: boolean;
    readonly skipAble: boolean;
}

export default IBehaviourBase;