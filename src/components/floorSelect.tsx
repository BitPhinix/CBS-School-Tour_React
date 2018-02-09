import "./floorSelect.css";
import * as React from "react";
import {Row, Col} from "react-bootstrap";
import mapStore from "../stores/mapStore";
import * as mapActions from "../actions/mapActions";

class FloorSelect extends React.Component<{}, {currentFloor: number}> {

    constructor(state) {
        super(state);

        //Default state
        this.state = {currentFloor: 1};

        //Hook up change event
        mapStore.on("change", () => this.updateState());
    }

    componentDidMount() {
        //Update state when component mounts
        this.updateState();
    }

    updateState() {
        this.setState({
           currentFloor: mapStore.state.currentFloor
        });
    }

    getSelectedState(floorId: number) {
        return this.state.currentFloor == floorId ? "clicked": "";
    }

    render() {
        return (
            <Col className="floorSelect">
                <Row onClick={() => mapActions.changeFloor(2)} className={this.getSelectedState(2)}><i>2 OG</i></Row>
                <Row onClick={() => mapActions.changeFloor(1)} className={this.getSelectedState(1)}><i>1 OG</i></Row>
                <Row onClick={() => mapActions.changeFloor(0)} className={this.getSelectedState(0)}><i>EG</i></Row>
                <Row onClick={() => mapActions.changeFloor(-1)} className={this.getSelectedState(-1)}><i>1 UG</i></Row>
            </Col>
        );
    }
}

export default FloorSelect;