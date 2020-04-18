import React from "react";
import {compose} from "recompose";
import {withFirebase} from "../Firebase";
import * as ROUTES from "../../constants/routes";
import {BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom';
import DATABASE from "../Database";
import ShopPortalBanner from "./ShopPortalBanner";
import ShopPortalLandingPage from "./ShopPortalOverview";
import EditCategoryPage from "./EditCategory/EditCategory";
import EditProductPage from "./EditProduct/EditProduct";
import EditRestaurantPage from "./EditRestaurant/EditRestaurant";
import CategoryWrapper from "./EditCategory/CategoryWrapper";
import RestaurantWrapper from "./EditRestaurant/RestaurantWrapper";
import POSPage from "./POS/POS";

class ShopPortal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRestaurantId: '',
            restaurants: '',
            userId: '',
            history: '',
        };
    }

    componentDidMount() {
        this.props.firebase.auth.onAuthStateChanged(user => {
            if (!user) {
                console.log("not signed in");
                //  TODO loadLogin(firebase);
                return;
            }
            this.props.firebase.db.ref(DATABASE + '/restaurantOwners/' + user.uid).on('value', snapshot => {
                if (!snapshot.hasChild('name')) {
                    // TODO loadRegisterAsRestaurantOwner();
                    return;
                }
                if (!snapshot.hasChild('currentRestaurant') && !snapshot.hasChild('restaurants')) {
                    console.log("You have no current restaurant or no restaurants at all, contact developers.");
                    return;
                }
                var restaurantIds = [];
                for (var restaurantKey in snapshot.val().restaurants) {
                    restaurantIds.push(restaurantKey);
                }
                this.setState({
                    restaurants: restaurantIds,
                    currentRestaurantId: snapshot.val().currentRestaurant,
                    userId: user.uid,
                });

            });
        });

    }

    setNewPage(pathName) {
        this.props.history.push({
            pathname: pathName,
            search: this.props.location.search,
        });
    }

    setNewCurrentRestaurant(newCurrentRestaurantId) {
        this.setState({currentRestaurantId: newCurrentRestaurantId});
    }

    render() {
        if (!this.state.currentRestaurantId){
            return '';
        }
        return (
            <div>
                <ShopPortalBanner restaurantIds={this.state.restaurants}
                                  currentRestaurantId={this.state.currentRestaurantId}
                                  setNewPage={(page) => this.setNewPage(page)}
                                  setNewCurrentRestaurant={(id) => this.setNewCurrentRestaurant(id)}/>
                <Switch>
                    <Route path={ROUTES.SHOP_PORTAL.EDIT_CATEGORY}>
                        <CategoryWrapper userId={this.state.userId}
                                          currentRestaurantId={this.state.currentRestaurantId}/>
                    </Route>
                    <Route path={ROUTES.SHOP_PORTAL.EDIT_PRODUCT}>
                        <EditProductPage currentRestaurantId={this.state.currentRestaurantId}/>
                    </Route>
                    <Route path={ROUTES.SHOP_PORTAL.EDIT_RESTAURANT}>
                        <RestaurantWrapper userId={this.state.userId} currentRestaurantId={this.state.currentRestaurantId}/>
                    </Route>
                    <Route path={ROUTES.SHOP_PORTAL.CREATE_RESTAURANT}>
                        <EditRestaurantPage newRestaurant={true} userId={this.state.userId}/>
                    </Route>
                    <Route path={ROUTES.SHOP_PORTAL.POS}>
                        <POSPage userId={this.state.userId} currentRestaurantId={this.state.currentRestaurantId}/>
                    </Route>
                    <Route path={ROUTES.SHOP_PORTAL.BASE_NAME}>
                        <ShopPortalLandingPage currentRestaurantId={this.state.currentRestaurantId}
                                               setNewPage={(page) => this.setNewPage(page)}/>
                    </Route>
                </Switch>
            </div>
        );
    }
}

const ShopPortalPage = compose(
    withRouter,
    withFirebase,
)(ShopPortal);

export default ShopPortalPage;