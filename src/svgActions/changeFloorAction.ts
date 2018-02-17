import SvgActionBase from "./svgActionBase";
import NewSvgRenderer from "../components/svgRenderer";
import {ReactElement} from "react";

class ChangeFloorAction implements SvgActionBase {

    skipAble: boolean = false;
    blockUserInput: boolean = false;
    runInstant: boolean = true;

    svgContent: string;
    floor: number;
    overlay: ReactElement<SVGElement>[];
    center: boolean;

    constructor(floor: number, center?: boolean, overlay?: ReactElement<SVGElement>[]) {
        this.floor = floor;
        this.overlay = overlay;
        this.center = center;
    }

    initialize(svgRenderer: NewSvgRenderer) {
        this.load("./svg/" + this.floor + ".svg");
    }

    update(svgRenderer: NewSvgRenderer, deltaTime: number): boolean {
        if(!this.svgContent)
            return true;

        svgRenderer.setState({
            inlineElements: this.svgContent,
            overlay: this.overlay ? this.overlay : []
        });

        return false;
    }

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

export default ChangeFloorAction;