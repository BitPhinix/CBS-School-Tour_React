import SvgBehaviourBase from "./iBehaviourBase";
import SvgRenderer from "../svgRenderer";
import {ReactElement} from "react";
import {Point} from "../../../typings";
import ZoomToPointBehaviour from "./zoomToPointBehaviour";
import mapUtils from "../../../utils/mapUtils";

class ChangeFloorBehaviour implements SvgBehaviourBase {

    skipAble: boolean = false;
    blockUserInput: boolean = false;
    runInstant: boolean = true;

    svgContent: string;
    floor: number;
    overlay: ReactElement<SVGElement>[];
	initialTransform: Point;
	initialScale: number;

    constructor(floor: number, initialTransform: Point, initialScale: number, overlay?: ReactElement<SVGElement>[]) {
        this.floor = floor;
        this.overlay = overlay;
        this.initialTransform = initialTransform;
        this.initialScale = initialScale;
    }

    initialize(svgRenderer: SvgRenderer) {
        this.load("./svg/" + this.floor + ".svg");
    }

    update(svgRenderer: SvgRenderer, deltaTime: number): boolean {
        if(!this.svgContent)
            return true;

        svgRenderer.setState({
            inlineElements: this.svgContent,
            overlay: this.overlay ? this.overlay : [],
            translation: this.initialTransform,
            scale: this.initialScale
        });

        return false;
    }

	onUserPan(xDifference: number, yDifference: number): void {}
	onUserZoom(zoomDifference: number, screenPoint: Point): void {}
	onUserPanStop(): void {}

    private load(path: string) {
        //Crate new XMLHttpRequest
        const xmlRequest = new XMLHttpRequest();

        //This function will be called when call is complete
        xmlRequest.onload = () => {
            //Remove enclosing svg tags (just get content)
            this.svgContent = xmlRequest.responseText.replace(new RegExp("<svg.*>|<\/svg.*>"), "");
        };

        //Make call (async)
        xmlRequest.open("GET", path, true);
        xmlRequest.send();
    }
}

export default ChangeFloorBehaviour;