import React from "react";
import {withFirebase} from "../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import * as ROUTES from "../../constants/routes";
import DATABASE from "../Database";

class ShopPortalLanding extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            admin: false,
        };
    }

    componentDidMount() {
       this.props.firebase.auth.onAuthStateChanged(user => {
            this.props.firebase.db.ref(DATABASE + '/admins').on('value', snapshot => {
                for (var key in snapshot.val()) {
                    if (user.uid === key) {
                        this.setState({admin: true});
                    }
                }
            });
        });
    }

    goToCustomerWebsite() {
        let tableNumber = btoa("1a");
        window.location.href = "/?tn=" + tableNumber + "&restaurantId=" + this.props.currentRestaurantId;
    }

    loadCreateRestaurant() {
        return <div className="card mt-2">
            <div className="card-body pointer">
                <div onClick={() => this.props.setNewPage(ROUTES.SHOP_PORTAL.CREATE_RESTAURANT)} className="text-primary">
                    <h2>Create Restaurant</h2>
                    <p>Create a new restaurant</p>
                </div>
            </div>
        </div>
    }

    render() {
        return (
            <div className="m-3">
                <div className="card mt-2">
                    <div className="card-body pointer">
                        <div onClick={() => this.goToCustomerWebsite()} className="text-primary">
                            <h2>Customer website</h2>
                            <p>View the customer website with the current menu</p>
                        </div>
                    </div>
                </div>
                <div className="card mt-2">
                    <div className="card-body pointer">
                        <div onClick={() => this.props.setNewPage(ROUTES.SHOP_PORTAL.EDIT_PRODUCT)} className="text-primary">
                            <h2>My Products</h2>
                            <p>Add, edit or delete products</p>
                        </div>
                    </div>
                </div>
                <div className="card mt-2">
                    <div className="card-body pointer">
                        <div onClick={() => this.props.setNewPage(ROUTES.SHOP_PORTAL.EDIT_CATEGORY)} className="text-primary">
                            <h2>My Categories</h2>
                            <p>Add, edit or delete categories <br/>
                                Change the category of a product</p>
                        </div>
                    </div>
                </div>
                <div className="card mt-2">
                    <div className="card-body pointer">
                        <div onClick={() => this.props.setNewPage(ROUTES.SHOP_PORTAL.EDIT_RESTAURANT)} className="text-primary">
                            <h2>My Restaurant</h2>
                            <p>Rename your restaurant<br/>
                            Create QR codes<br/>
                            Change restaurant color <br/>
                            Add or remove printers
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card mt-2">
                    <div className="card-body pointer">
                        <div onClick={() => this.props.setNewPage(ROUTES.SHOP_PORTAL.POS)} className="text-primary">
                            <h2>Untill integration</h2>
                            <p>Add your API key <br/>
                            Fetch POS menu
                            </p>
                        </div>
                    </div>
                </div>
                {this.state.admin ? this.loadCreateRestaurant() : null}
            </div>
        );
    }
}


const ShopPortalLandingPage = compose(
    withRouter,
    withFirebase,
)(ShopPortalLanding);

export default ShopPortalLandingPage;