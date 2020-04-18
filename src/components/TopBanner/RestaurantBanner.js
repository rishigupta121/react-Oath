import React from 'react';
import DATABASE from "../Database";
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';
import {withFirebase} from '../Firebase';

class RestaurantBannerBase extends React.Component {
    constructor(props) {
        super(props);
        var url = new URL(window.location.href);
        var restaurantId = url.searchParams.get("restaurantId");
        var tableNumber = atob(url.searchParams.get("tn"));
        this.state = {
            imageUrl: '',
            restaurantName: '',
            tableNumber: tableNumber,
            restaurantId: restaurantId,
        };
    }

    componentDidMount() {
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + this.state.restaurantId).once('value').then(snapshot => {
            if (snapshot.val()) {
                this.setState({
                    restaurantName: snapshot.val().name,
                    imageUrl: snapshot.val().imageUrl,
                });
            }
        });
    }

    render() {
        return (
            <div className="banner">
                <div id="current-table" className="w-100">
                    <h3 className="font-weight-bold tablenumber ml-3 mt-3">{this.state.tableNumber} </h3>
                    {this.state.imageUrl ? <img src={this.state.imageUrl} className="restaurant-logo mr-3"/> : ''}
                </div>

                <h3 id="restaurant-name" className="w-100 font-weight-bold">{this.state.restaurantName}</h3>
            </div>
        );
    }
}

const RestaurantBanner = compose(
    withRouter,
    withFirebase,
)(RestaurantBannerBase);

export default RestaurantBanner;