import React from "react";
import {compose} from "recompose";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';

class PickedColorBase extends React.Component {
    constructor(props) {
        super(props);
        this.setColor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setColor();
    }


    setColor() {

    }

    render() {
        return (
            <div id="color-box" style={{
                backgroundColor: this.props.color
            }}></div>
        );
    }

}

const PickedColor = compose(
    withRouter,
    withFirebase,
)(PickedColorBase);

export default PickedColor;