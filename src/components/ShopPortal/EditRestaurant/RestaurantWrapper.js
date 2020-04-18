import React from "react";
import {compose} from "recompose";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import EditRestaurantPage from "./EditRestaurant";
import GenerateQRPage from "./GenerateQR";
import AddPrinter from "./AddPrinter";
import RemovePrinter from "./RemovePrinter";

class RestaurantWrapperBase extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="m-3">
                <EditRestaurantPage newRestaurant={false} userId={this.props.userId}
                                    currentRestaurantId={this.props.currentRestaurantId}/>
                <GenerateQRPage currentRestaurantId={this.props.currentRestaurantId} />
                <AddPrinter currentRestaurantId={this.props.currentRestaurantId} />
                <RemovePrinter currentRestaurantId={this.props.currentRestaurantId} />
            </div>
        );
    }
}

const RestaurantWrapper = compose(
    withRouter,
    withFirebase,
)(RestaurantWrapperBase);

export default RestaurantWrapper;