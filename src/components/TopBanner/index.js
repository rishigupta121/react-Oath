import React from 'react';
import * as ROUTES from "../../constants/routes";
import RestaurantBanner from "./RestaurantBanner";

class TopBanner extends React.Component {
    render() {
        if (!this.props.location || this.props.location.pathname === ROUTES.LANDING) {
            return <RestaurantBanner/>;
            return '';
        }else{
            return '';
        }

    }
}

export default TopBanner;