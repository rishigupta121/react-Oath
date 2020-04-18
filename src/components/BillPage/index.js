import React from "react";
import {compose} from 'recompose';
import {withFirebase} from '../Firebase';
import {withRouter} from 'react-router-dom';
import DATABASE from "../Database";
import BillProduct from "./BillProduct";
import * as ROUTES from '../../constants/routes';
import CheckoutProduct from "../Checkout/CheckoutProduct";
import {filterCategoriesOnTime} from "../HelperFunctions/FilterCategories";
import ProductComment from "../ProductPage/ProductComment";
import ProductCounter from "../ProductPage/ProductCounter";
import AddProductButton from "../ProductPage/AddProductButton";
import Routing from "../Routing";

class BillPageBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {"message": "Bill is loading..", "content": "", "products": "", "totalAmount" : ""};
        this.getBill();
    }

    componentDidMount() {
        var url = new URL(window.location.href);
        var tableNumber = atob(url.searchParams.get("tn"));
        var restaurantId = url.searchParams.get("restaurantId");
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId + '/products').once('value').then(snapshot => {
            var allProducts = snapshot.val();
            this.setState({
                products: allProducts
            });
        });
    }

    getBill() {
        let url = new URL(window.location.href);
        let restaurantId = url.searchParams.get('restaurantId');
        let tableNumber = atob(url.searchParams.get('tn'));
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {

            let response = JSON.parse(xhr.responseText).body;
            console.log(response);
            if (response.ReturnCode == 3) {
                // No active orders on table
                this.setState({"message": "There are no open orders on this table."});
            } else {
                let obj = response.Transaction.Orders;
                this.setState({"content": obj, "totalAmount" : response.TotalAmount});
            }

        });
        xhr.open('GET', 'http://pos.order-me.nu/pos/tableInfo/?tableNumber=' + tableNumber + '&restaurantId=' + restaurantId);
        xhr.send()
    }


    getProductByPosId(posId) {
        for (var key in this.state.products) {
            let product = this.state.products[key];
            if (product.hasOwnProperty('posId') && product.posId === posId) {
                return product;
            }
        }
    }

    /*
    In the future when many more POS systems are added it's probably smart to move this code, that converts the tableInfo to the right format, to the php server.
    Then the code can be dynamic to the type of pos that is being used.
     */
    getContent() {
        if (!this.state.content) {
            return <span>{this.state.message}</span>
        }
        let orders = this.state.content;
        let html = [];
        for (var i = 0; i < orders.length; i++) {
            let items = orders[i].Items;
            if(items.length > 0){
                var myDate = new Date(orders[i].DateTime);
                var minutes = myDate.getMinutes();
                var hours = myDate.getHours();
                html.push(" Order " + hours + ":" + minutes);
            }
            for (var j = 0; j < items.length; j++) {
                let item = items[j];
                let shoppingItem = {};
                shoppingItem.count = item.Quantity;
                // TODO obtain this from the extra attribute
                shoppingItem.comment = "";
                shoppingItem.extraAttributes = [];
                let product = this.getProductByPosId(item.ArticleId);
                html.push(<BillProduct key={j + " bill product " + i} firebase={this.props.firebase} clickable={false}
                                       product={product} shoppingItem={shoppingItem}/>);
            }
        }
        return html;
    }

    cancel() {
        this.props.history.push({
            pathname: ROUTES.LANDING,
            search: this.props.location.search,
        });
    }

    render() {
        return (

            <div id="product-view">
                <div className="product-detail-wrapper">
                    <div className="product-detail">
                        <h5 className="card-name">The bill</h5>
                        <div className="checkout-products mt-2">
                            {this.state.products ? this.getContent() : ''}
                        </div>
                    </div>
                    <div className="pl-3 pr-3 pb-3 pt-3 fixed-buttons">
                        <div className="">
                            <button className="order-button" onClick={() => this.cancel()}>
                                <div className="w-100">
                                    {this.state.totalAmount ? <div className="top-padding-3 order-price mr-2">€{parseFloat(this.state.totalAmount).toFixed(2)}</div> : ''}
                                </div>
                                <div className=" order-me-button w-100">Close bill</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}


const BillPage = compose(
    withRouter,
    withFirebase,
)(BillPageBase);

export default BillPage;