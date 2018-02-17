import SvgActionBase from "./svgActionBase";
import NewSvgRenderer from "../components/newSvgRenderer";
import {Point} from "../typings";

class MoveSvgAction implements SvgActionBase {
    runInstant: boolean = false;
    blockUserInput: boolean = false;
    skipAble: boolean = true;

    targetPosition: Point;
    animationDuration: number;

    private timePassed: number = 0;
    private xDifference: number;
    private yDifference: number;

    constructor(targetPosition: Point, animationDuration: number) {
        this.targetPosition = targetPosition;
        this.animationDuration = animationDuration;
    }

    initialize(svgRenderer: NewSvgRenderer) {
        this.xDifference = svgRenderer.state.translation.x - this.targetPosition.x;
        this.xDifference = svgRenderer.state.translation.y - this.targetPosition.y;

        //TODO calculate animationDuration
    }

    update(svgRenderer: NewSvgRenderer, deltaTime: number): boolean {
        if(deltaTime > this.animationDuration - this.timePassed)
            deltaTime = this.animationDuration - this.timePassed;

        this.timePassed += deltaTime;

        const newY = this.yDifference / this.animationDuration * deltaTime + svgRenderer.state.translation.y;
        const newX = this.xDifference / this.animationDuration * deltaTime + svgRenderer.state.translation.x;

        svgRenderer.setState({
            translation: {
                x: newX,
                y: newY
            }
        });

        return this.timePassed < this.animationDuration;
    }
}

export default MoveSvgAction;