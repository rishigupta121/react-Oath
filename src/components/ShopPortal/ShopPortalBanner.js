import React from "react";
import {withFirebase} from "../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import * as ROUTES from "../../constants/routes";
import { ReactComponent as LeftArrowLogo } from '../../img/left-arrow.svg';
import DATABASE from "../Database";
import {ReactComponent as PlusLogo} from "../../img/add.svg";
import {ThemeContext} from "../ThemeContext";

class ShopPortalBannerBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRestaurantId: this.props.currentRestaurantId,
            currentRestaurantName: '',
            restaurants: [],
            showRestaurantSelection: false,
        };
        this.loadNewRestaurants();
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.currentRestaurantId !== prevProps.currentRestaurantId) {
            this.setState({'currentRestaurantId': this.props.currentRestaurantId});
        }

        if (this.props.restaurantIds === prevProps.restaurantIds) {
            return
        }
        this.setState({'restaurants': []}, this.loadNewRestaurants);
    }

    loadNewRestaurants(){
        for (const restaurantId of this.props.restaurantIds) {
            this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId).on('value', snapshot => {
                if (snapshot.val() && snapshot.val().name) {
                    var restaurant = {};
                    restaurant.id = restaurantId;
                    restaurant.name = snapshot.val().name;
                    if (this.state.currentRestaurantId === restaurant.id) {
                        this.setState({
                            currentRestaurantName: restaurant.name
                        });
                    }
                    var restaurants = this.state.restaurants;
                    restaurants.push(restaurant);
                    this.setState({
                        restaurants: restaurants
                    });
                } else {
                    console.log("No restaurant name found");
                }
            });
        }
    }

    handleChange(event) {
        const value = event.target.value;

        for (const restaurant of this.state.restaurants) {
            if (restaurant.id === value) {
                this.setState({
                    currentRestaurantId: restaurant.id,
                    currentRestaurantName: restaurant.name
                });
                this.props.firebase.auth.onAuthStateChanged(user => {
                    this.props.firebase.db.ref(DATABASE + '/restaurantOwners/' + user.uid + '/currentRestaurant').set(restaurant.id);
                });
                this.toggleRestaurantSelectionMenu();
                this.props.setNewCurrentRestaurant(restaurant.id);
            }
        }
    }

    getRestaurantsAsOptions() {
        var list = [];
        for (const restaurant of this.state.restaurants) {
            list.push(
                <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
            );
        }
        return list;
    }

    loadRestaurantSelectionMenu() {
        if (this.state.showRestaurantSelection) {
            return <select className="browser-default custom-select" name="restaurantId"
                           value={this.state.currentRestaurantId}
                           onChange={this.handleChange}>
                {this.getRestaurantsAsOptions()}
            </select>
        }
    }

    toggleRestaurantSelectionMenu() {
        this.setState({"showRestaurantSelection": !this.state.showRestaurantSelection});
    }

    switchRestaurant(restaurants) {
        if (this.props.history.location.pathname !== ROUTES.SHOP_PORTAL.BASE_NAME) {
            return '';
        }
        if (restaurants.length > 1) {
            return <div className="pointer"><u onClick={() => this.toggleRestaurantSelectionMenu()}>Switch
                restaurant</u>
                {this.loadRestaurantSelectionMenu()}
            </div>
        }
    }

    headerClasses() {
        if (this.props.history.location.pathname === ROUTES.SHOP_PORTAL.BASE_NAME) {
            return "mb-0";
        }
        return "mb-0 text-primary pointer";
    }

    leftArrow(){
        if (this.props.history.location.pathname !== ROUTES.SHOP_PORTAL.BASE_NAME) {
            return <LeftArrowLogo className="mr-1" alt="left-arrow-logo" height="15px" width="15px"  fill={this.context.primaryColor}/>;
        }
    }

    render() {
        return (
            <div className="p-3 bg-white border-bottom">
                <h4 onClick={() => this.props.setNewPage(ROUTES.SHOP_PORTAL.BASE_NAME)} className={this.headerClasses()}>
                    {this.leftArrow()}
                    <a>{this.state.currentRestaurantName} Shop
                        Portal</a>
                </h4>
                {this.switchRestaurant(this.state.restaurants)}
            </div>
        );
    }
}
ShopPortalBannerBase.contextType = ThemeContext;

const ShopPortalBanner = compose(
    withRouter,
    withFirebase,
)(ShopPortalBannerBase);

export default ShopPortalBanner;
