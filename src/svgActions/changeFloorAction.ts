import SvgActionBase from "./svgActionBase";
import NewSvgRenderer from "../components/newSvgRenderer";
import {ReactElement} from "react";

class ChangeFloorAction implements SvgActionBase {

    skipAble: boolean = false;
    blockUserInput: boolean = false;
    runInstant: boolean = true;

    svgContent: string;
    svgPath: string;
    overlay: ReactElement<SVGElement>[];
    center: boolean;

    constructor(svgPath: string, center?: boolean, overlay?: ReactElement<SVGElement>[]) {
        this.svgPath = svgPath;
        this.overlay = overlay;
        this.center = center;
    }

    initialize(svgRenderer: NewSvgRenderer) {
        this.load(this.svgPath);
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
        xmlRequest.send(null);
    }
}

export default ChangeFloorAction;