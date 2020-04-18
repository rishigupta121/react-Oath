import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {ThemeContext, themes} from "../ThemeContext";
import 'firebase/auth';
import * as ROUTES from '../../constants/routes';
import NavigationMenu from '../NavigationMenu/';
import TopBanner from "../TopBanner";
import {withFirebase} from '../Firebase';
import {withRouter} from 'react-router-dom';
import DATABASE from "../Database";
import ProductPage from "../ProductPage";
import ProductMenuPage from "../ProductMenu";
import LogInPage from "../LogIn";
import CheckoutPage from "../Checkout";
import {compose} from "recompose";
import RestaurantBanner from "../TopBanner/RestaurantBanner";
import ShopPortal from "../ShopPortal/ShopPortal";
import ShopPortalPage from "../ShopPortal/ShopPortal";
import EditProductPage from "../ShopPortal/EditProduct/EditProduct";
import LoadTheme from "./LoadTheme";
import BillPage from "../BillPage";

class AppBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: themes.standard,
            themeLoaded: false,
            restaurantId: '',
            permission: true,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.location.state && this.props.location.state.loggedIn) {
            if(!this.state.restaurantId){
                this.loadRestaurantId();
            }
        }
    }

    componentDidMount() {
        this.loadRestaurantId();
    }

    loadRestaurantId() {
        var restaurantId = '';
        var url = new URL(window.location.href);
        if (url.pathname === ROUTES.SHOP_PORTAL.BASE_NAME) {
            this.props.firebase.auth.onAuthStateChanged(user => {
                if (user) {
                    this.props.firebase.db.ref(DATABASE + '/restaurantOwners/' + user.uid + '/currentRestaurant/').on('value', snapshot => {
                        this.setState({restaurantId: snapshot.val()});
                        this.permission(true);
                    });
                    //TODO do we need to catch this with a permission false call?
                } else {
                    this.permission(false);
                }
            });
        } else {
            restaurantId = url.searchParams.get("restaurantId");
            this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId).once('value').then(snapshot => {
                this.setState({restaurantId: restaurantId});
                this.permission(true);
            }).catch(error => {
                if (error.code === "PERMISSION_DENIED"){
                    this.permission(false);
                }
            });
        }
    }

    permission(hasPermission) {
        this.setState({permission: hasPermission});
        if(!hasPermission && this.props.location.pathname === ROUTES.SHOP_PORTAL.BASE_NAME) {
            this.props.history.push({
                pathname: ROUTES.LOG_IN,
                search: this.props.location.search,
                state: {lastPage: this.props.location.pathname}
            });
        }
    }

    updateTheme(theme) {
        this.setState({theme: theme, themeLoaded: true});
    }

    render() {
        if (!this.state.themeLoaded && this.state.permission) {
            return <LoadTheme updateTheme={(theme) => this.updateTheme(theme)} restaurantId={this.state.restaurantId}/>;
        }
        return (
            <div className="App">
                <ThemeContext.Provider value={this.state.theme}>
                    <LoadTheme updateTheme={(theme) => this.updateTheme(theme)} restaurantId={this.state.restaurantId}/>
                    <div id="wrapper">
                        <Switch>
                            <Route path={ROUTES.LOG_IN}>
                                <LogInPage/>
                            </Route>
                            <Route path={ROUTES.CHECKOUT}>
                                <CheckoutPage/>
                            </Route>
                            <Route path={ROUTES.PRODUCT_PAGE}>
                                <ProductPage/>
                            </Route>
                            <Route path={ROUTES.BILL_PAGE}>
                                <BillPage/>
                            </Route>
                            <Router path={ROUTES.SHOP_PORTAL.BASE_NAME}>
                                <ShopPortalPage/>
                            </Router>
                            <Route
                                path={ROUTES.LANDING}> {/* The LANDING page must be placed at the bottom of routes */}
                                <RestaurantBanner/>
                                <NavigationMenu/>
                                <ProductMenuPage/>
                            </Route>
                            <Redirect to={ROUTES.LANDING}/>
                        </Switch>
                    </div>
                </ThemeContext.Provider>
            </div>
        );
    }
}

const App = compose(
    withFirebase,
    withRouter,
)(AppBase);

export default App;
