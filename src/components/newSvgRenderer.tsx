import * as React from "react";
import {Point} from "../typings";
import {ReactElement} from "react";
import SvgActionBase from "../svgActions/svgActionBase";

class NewSvgRenderer extends React.Component<{
    defaultElement: string
}, {
    inlineElements: string,
    scale: number,
    translation: Point,
    overlay: ReactElement<SVGElement>[],
    ready: boolean,
    rotation: number
}> {
    svg: SVGSVGElement;
    lastUpdate: number = Date.now();
    actionQue: SvgActionBase[] = [];
    currentAction: SvgActionBase;

    processAction(action: SvgActionBase) {
        //If action does not need to be run instantly
        if(!action.runInstant) {
            //Add action to que
            this.actionQue.push(action);

            //return
            return;
        }

        //Clear que
        this.actionQue = [];

        //Set currentAction to action
        this.currentAction = action;

        //Call initialize
        this.currentAction.initialize(this);
    }

    update() {
        //Get current time
        const currentTime = Date.now();

        //Calculate deltaTime
        const deltaTime = currentTime - this.lastUpdate;

        //Update lastUpdate
        this.lastUpdate = currentTime;

        //If currentAction is null or currentAction.update() returns false
        if(!this.currentAction || !this.currentAction.update(this, deltaTime))
            //Get next action from que
            this.currentAction = this.getNextAction();

        //Request a new AnimationFrame
        window.requestAnimationFrame(() => this.update());
    }

    getNextAction() {
        //If que is empty
        if(this.actionQue.length = 0)
            //Return nothing
            return;

        //Get next element in que
        const nextElement = this.actionQue.pop();

        //Call initialize
        nextElement.initialize(this);

        //return nextElement
        return nextElement;
    }

    render() {
        //If map isn´t loaded
        if(!this.state.ready)
            //Return empty svg
            return <svg ref={(svg) => this.svg = svg}/>;

        return (
            <svg ref={(svg) => this.svg = svg} preserveAspectRatio="none" width="100%" height="100%">
                <g transform={
                    "scale(" + this.state.scale + ") " +
                    "translate(" + this.state.translation.x + ", " + this.state.translation.y + ") "}>
                    <g dangerouslySetInnerHTML={{__html: this.state.inlineElements}}/>
                    <g>{this.state.overlay}</g>
                </g>
            </svg>
        );
    }
}

export default NewSvgRenderer;