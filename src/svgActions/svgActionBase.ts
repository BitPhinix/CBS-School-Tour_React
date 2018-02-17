import NewSvgRenderer from "../components/svgRenderer";

abstract class SvgActionBase {
    abstract initialize(svgRenderer: NewSvgRenderer);
    abstract update(svgRenderer: NewSvgRenderer, deltaTime: number): boolean;
    abstract readonly runInstant: boolean;
    abstract readonly blockUserInput: boolean;
    abstract readonly skipAble: boolean;
}

export default SvgActionBase;