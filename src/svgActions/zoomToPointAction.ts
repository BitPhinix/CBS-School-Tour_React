import SvgActionBase from "./svgActionBase";
import NewSvgRenderer from "../components/newSvgRenderer";
import {ReactElement} from "react";
import {Point} from "../typings";

class ZoomToScreenPointAction implements SvgActionBase {

    blockUserInput: boolean = false;
    skipAble: boolean = false;
    targetScale: number;
    point: Point;
    runInstant: boolean;
    isScreenPoint: boolean;
    animationDuration: number;

    private timePassed: number = 0;
    private scaleDifference: number;
    private xDifference: number;
    private yDifference: number;

    constructor(targetScale: number, point: Point, isScreenPoint: boolean, animationDuration?: number, runInstant: boolean = false) {
        this.targetScale = targetScale;
        this.point = point;
        this.runInstant = runInstant;
        this.animationDuration = animationDuration;
    }

    initialize(svgRenderer: NewSvgRenderer) {
        if(this.isScreenPoint) {
            this.xDifference = (svgRenderer.svg.clientWidth / 2 - this.point.x) - svgRenderer.state.translation.x;
            this.yDifference = (svgRenderer.svg.clientHeight / 2 - this.point.y) - svgRenderer.state.translation.y;
        }
        else {
            this.xDifference = (this.point.x / svgRenderer.state.scale) * (1 - svgRenderer.state.scale) - (this.point.x / this.targetScale) * (1 - this.targetScale);
            this.yDifference = (this.point.y / svgRenderer.state.scale) * (1 - svgRenderer.state.scale) - (this.point.y / this.targetScale) * (1 - this.targetScale);
        }

        this.scaleDifference = this.targetScale - svgRenderer.state.scale;

        if(!this.animationDuration)
            this.animationDuration = this.scaleDifference * 1000;
    }

    update(svgRenderer: NewSvgRenderer, deltaTime: number): boolean {
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

export default ZoomToScreenPointAction;