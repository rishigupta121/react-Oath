import React from "react";
import {withRouter} from 'react-router-dom';
import * as ROUTES from "../../constants/routes";
import {compose} from "recompose";
import {withFirebase} from '../Firebase';

class AddProductButtonBase extends React.Component {

    render() {
        return (
            <div className="pb-3 pl-4 pr-4 pp-buttons fixed-buttons">
                <button className="col-7 order-button" onClick={() => this.props.addProduct()}>
                    OrderMe for €{parseFloat(this.props.price).toFixed(2)}
                </button>
                <button className="col-4 cancel-button offset-1 mt-2" onClick={() => this.props.cancel()}>
                    Cancel
                </button>
            </div>
        );
    }
}

const
    AddProductButton = compose(
        withRouter,
        withFirebase,
    )(AddProductButtonBase);

export default AddProductButton;
