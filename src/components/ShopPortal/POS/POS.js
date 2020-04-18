import React from "react";
import {compose} from "recompose";
import {BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom';
import AddKey from "./AddKey";
import FetchMenu from "./FetchMenu";

class POS extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="m-3">
                <h4>Add API key</h4>
                <div className="card">
                    <div className="card-body">
                        <AddKey restaurantId={this.props.currentRestaurantId}/>
                    </div>
                </div>
                <h4 className="mt-5">Fetch Untill menu</h4>
                <div className="card">
                    <div className="card-body">
                        <FetchMenu restaurantId={this.props.currentRestaurantId}/>
                    </div>
                </div>
            </div>
        );
    }
}

const POSPage = compose(
    withRouter,
)(POS);

export default POSPage;