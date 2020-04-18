import React from "react";
import CheckoutProduct from "./CheckoutProduct";
import {compose} from 'recompose';
import {withFirebase} from '../Firebase';
import {withRouter} from 'react-router-dom';
import DATABASE from "../Database";
import {ReactComponent as CloseLogo} from "../../img/x.svg";
import * as ROUTES from "../../constants/routes";
import {ThemeContext} from "../ThemeContext";
import {filterCategoriesOnTime} from "../HelperFunctions/FilterCategories";

class CheckoutBase extends React.Component {
    constructor(props) {
        super(props);
        let noProduct = false;
        if (!this.props.location.state || !this.props.location.state.allProducts) {
            noProduct = true;
            this.loadAllProducts();
        }

        this.state = {
            noProduct: noProduct,
            shoppingList: [],
            products: this.props.location.state.allProducts,
            restaurantHasPos: false
        };
    }

    componentDidMount() {
        var url = new URL(window.location.href);
        var tableNumber = atob(url.searchParams.get("tn"));
        var restaurantId = url.searchParams.get("restaurantId");
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId + '/shoppingLists/' + tableNumber).on('value', snapshot => {
            var shoppingList = [];
            if (snapshot.val()) {
                shoppingList = snapshot.val().products;
            }
            this.setState({
                shoppingList: shoppingList,
            });
        });

        //In theory you can click the order button before this call is done, in that case the restaurantHasPos boolean is still false.
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId + '/pos/type').on('value', snapshot => {
            if (snapshot.val()) {
                if (snapshot.val() == "untill") {
                    this.setState({restaurantHasPos: true});
                }
            }
        });


    }

    loadAllProducts() {
        var url = new URL(window.location.href);
        var tableNumber = atob(url.searchParams.get("tn"));
        var restaurantId = url.searchParams.get("restaurantId");
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId).once('value').then(snapshot => {
            if (!snapshot.hasChild('name') || !snapshot.hasChild('id')) {
                alert("There doesn't exist a restaurant for this url.");
                return;
            }
            var allProducts = snapshot.val().products;
            this.setState({
                products: allProducts,
                noProduct: false
            });
        });
    }

    goToLandingPage() {
        this.props.history.push({
            pathname: ROUTES.LANDING,
            search: this.props.location.search
        });
    }

    render() {
        if (this.state.noProduct) {
            return 'There are no products in your basket';
        }
        return (
            <div className="checkout-wrapper">
                <div className="checkout-products">
                    <div className="checkout-your-order">
                        <h5 className="font-weight-bold my-basket">My Basket</h5>
                        <span id="close-x" onClick={() => this.props.history.push({
                            pathname: ROUTES.LANDING,
                            search: this.props.location.search
                        })}>
                            <CloseLogo alt="close" height="15px" width="15px" fill={this.context.primaryColor}/>
                        </span>
                    </div>
                    <div className="checkout-items">
                        {this.createCheckoutProducts()}
                    </div>
                </div>
                <div className="checkout-buttons mt-4">
                    <div className="mt-2">
                        <div className="checkout-item-left font-weight-bold">Total</div>
                        <div
                            className="checkout-item-right font-weight-bold">€{this.calculateSubtotal().toFixed(2)}</div>
                    </div>
                    <button className="col-7 order-button background-blue mt-3" id="ordermenow-button"
                            onClick={() => this.writeOrderToDatabase()}>OrderMe Now
                    </button>
                    <button className="col-4 offset-1 cancel-button"
                            onClick={() => this.goToLandingPage()}>Cancel
                    </button>
                </div>
            </div>
        );
    }

    getBrowserType() {
        // Opera 8.0+
        var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        if (isOpera) {
            return "Opera";
        }

        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';
        if (isFirefox) {
            return "Firefox";
        }

        // Safari 3.0+ "[object HTMLElementConstructor]"
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window['safari']);
        if (isSafari) {
            return "Safari";
        }
        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        if (isIE) {
            return "Internet Explorer";
        }
        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;
        if (isEdge) {
            return "Edge";
        }

        // Chrome 1 - 79
        var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
        if (isChrome) {
            return "Chrome";
        }

        // Edge (based on chromium) detection
        var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
        if (isEdge) {
            return "Edge (based on chromium)";
        }

        // Blink engine detection
        var isBlink = (isChrome || isOpera) && !!window.CSS;
        if (isBlink) {
            return "Blink";
        }

        return "Unkown";
    }

    writeOrderToDatabase() {
        document.getElementById('ordermenow-button').disabled = 'disabled';
        var url = new URL(window.location.href);
        var restaurantId = url.searchParams.get('restaurantId');
        var tableNumber = atob(url.searchParams.get('tn'));

        var path = DATABASE + "/restaurants/" + restaurantId;
        var key = this.props.firebase.db.ref().child(path).push().key;
        var shoppingList = this.state.shoppingList;

        var order = {};
        for (var shoppingItemKey in shoppingList) {
            var shoppingItem = shoppingList[shoppingItemKey];
            if (shoppingItem.count > 0) {
                var product = this.state.products[shoppingItem.productId];
                shoppingItem.name = product.name;
                shoppingItem.price = product.price;
                order[shoppingItemKey] = shoppingItem;
            }
        }
        var d = new Date();
        var month = parseInt(d.getMonth()) + 1;
        var userInfo = window.navigator.userAgent;
        var orderContent = {
            id: key,
            table: tableNumber,
            order: order,
            type: "order",
            date: d.getFullYear() + "-" + month + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes(),
            userInfo: userInfo,
        };
        this.props.firebase.db.ref(path + "/orders/" + key).set(orderContent);

        if (this.state.restaurantHasPos) {
            console.log(orderContent);
            var xhr = new XMLHttpRequest();
            xhr.addEventListener('load', () => {
                let response = JSON.parse(xhr.responseText).body;
                if (response.ReturnCode === 0) {
                    this.completeOrder(path, key, orderContent, tableNumber, restaurantId);
                } else {
                    console.log("Placing order was not successfully");
                    console.log(response);
                }
            });
            console.log('http://pos.order-me.nu/pos/order/?restaurantId=' + restaurantId + "&tableNumber=" + tableNumber);
            xhr.open('POST', 'http://pos.order-me.nu/pos/order/?restaurantId=' + restaurantId + "&tableNumber=" + tableNumber, true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            // xhr.withCredentials = true;
            xhr.send(JSON.stringify(orderContent));
        } else {
            this.completeOrder(path, key, orderContent, tableNumber, restaurantId);

            this.props.history.push({
                pathname: ROUTES.LANDING,
                search: this.props.location.search,
            });
        }
    }

    completeOrder(path, key, orderContent, tableNumber, restaurantId) {
        this.props.firebase.db.ref(DATABASE + '/printers/').on('value', snapshot => {
            var printers = snapshot.val();
            var macs = Object.keys(printers);

            var macsOfThisRestaurant = [];
            for (var i = 0; i < macs.length; i++) {
                if (printers[macs[i]] === restaurantId) {
                    macsOfThisRestaurant.push(macs[i]);
                }
            }

            this.props.firebase.db.ref(path + "/orders/" + key).set(orderContent);

            if (macsOfThisRestaurant.length == 0) {
                this.props.firebase.db.ref(path + "/shoppingLists/" + tableNumber).remove().then(snapshot => {
                    console.log(path + "/shoppingLists/" + tableNumber);
                    this.props.history.push({
                        pathname: ROUTES.LANDING,
                        search: this.props.location.search,
                    });
                });
            }
            for (i = 0; i < macsOfThisRestaurant.length; i++) {
                orderContent.printer = macsOfThisRestaurant[i];
                this.props.firebase.db.ref(path + "/print-jobs/" + orderContent.id).set(orderContent).then(snapshot => {
                    this.props.firebase.db.ref(path + "/shoppingLists/" + tableNumber).remove().then(snapshot => {
                        console.log(path + "/shoppingLists/" + tableNumber);
                        this.props.history.push({
                            pathname: ROUTES.LANDING,
                            search: this.props.location.search,
                        });
                    });
                });
            }
            alert("Your order was placed!");
        });
    }

    createCheckoutProducts() {
        var html = [];
        for (var shoppingItemKey in this.state.shoppingList) {
            var shoppingItem = this.state.shoppingList[shoppingItemKey];
            var product = this.state.products[shoppingItem.productId];
            if (shoppingItem.count > 0) {
                html.push(<CheckoutProduct key={shoppingItemKey} firebase={this.props.firebase} clickable={false}
                                           product={product} shoppingItemId={shoppingItemKey}
                                           shoppingItem={shoppingItem}/>);
            }
        }
        return html;
    }


    calculateSubtotal() {
        var subtotal = 0;
        for (var shoppingItemKey in this.state.shoppingList) {
            var shoppingItem = this.state.shoppingList[shoppingItemKey];
            let productId = shoppingItem.productId;
            if (shoppingItem.count > 0) {
                let product = this.state.products[productId];
                var productPrice = parseFloat(product.price);
                if (product.hasOwnProperty('extraAttributes') && shoppingItem.hasOwnProperty('extraAttributes')) {
                    for (var key in product.extraAttributes) {
                        if (shoppingItem.extraAttributes.hasOwnProperty(key) && shoppingItem.extraAttributes[key]) {
                            let attribute = product.extraAttributes[key];
                            if (attribute.increase) {
                                productPrice += parseFloat(attribute.priceDifference);
                            } else {
                                productPrice -= parseFloat(attribute.priceDifference);
                            }
                        }
                    }
                }

                subtotal = subtotal + productPrice * shoppingItem.count;
            }
        }
        return subtotal;
    }
}

CheckoutBase.contextType = ThemeContext;


const CheckoutPage = compose(
    withFirebase,
    withRouter,
)(CheckoutBase);

export default CheckoutPage;
