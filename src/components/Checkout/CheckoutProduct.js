import React from "react";
import DATABASE from "../Database";
import { ReactComponent as MinusLogo } from '../../img/minus.svg';
import { ReactComponent as PlusLogo } from '../../img/add.svg';
import {ThemeContext} from "../ThemeContext";
import * as ROUTES from "../../constants/routes";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";

class CheckoutProductBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: this.props.shoppingItem.count,
        }
    }

    getComment() {
        if (this.props.shoppingItem.comment) {
            return <p className="checkout-item-comment mb-0">Comment: {this.props.shoppingItem.comment}</p>
        }
    }

    getExtraAttributes() {
        var html = [];
        for (var key in this.props.shoppingItem.extraAttributes) {
            if (this.props.shoppingItem.extraAttributes.hasOwnProperty(key)) {
                var extraAttribute = this.props.shoppingItem.extraAttributes[key];
                if (extraAttribute) {
                    html.push(<p key={key}
                                 className="checkout-item-extra-attribute mb-0">{this.props.product.extraAttributes[key].name}</p>);
                }
            }
        }
        return html;
    }

    onClick(value) {
        this.state.count += value;
        if (this.state.count < 0) {
            this.state.count = 0;
        }
        var url = new URL(window.location.href);
        var tableNumber = atob(url.searchParams.get("tn"));
        var restaurantId = url.searchParams.get("restaurantId");
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId + '/shoppingLists/' + tableNumber + '/products/' + this.props.shoppingItemId + "/count").set(this.state.count);
    }

    getCounter() {
        let theme = this.context;
        return <div className="row counter">
            <span className="" onClick={() => this.onClick(-1)}><MinusLogo height="15px" width="15px" fill={theme.primaryColor}/></span>
            <span className="checkout-counter">{this.state.count}</span>
            <span className="" onClick={() => this.onClick(1)}><PlusLogo height="15px" width="15px" fill={theme.primaryColor}/></span>
        </div>
    }

    getPrice() {
        let product = this.props.product;
        let shoppingItem = this.props.shoppingItem;
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
        return productPrice * shoppingItem.count;
    }

    onClickProduct(){
        this.props.history.push({
            pathname: ROUTES.PRODUCT_PAGE,
            state: {
                product: this.props.product,
                previousPage: ROUTES.CHECKOUT,
                shoppingId: this.props.shoppingItemId,
            },
            search: this.props.location.search,
        });
    }

    render() {
        return (
            <div className="checkout-item">
                <div className="checkout-item-left-small">
                    {this.getCounter()}
                </div>
                <div className="checkout-items-middle-left" onClick={() => this.onClickProduct()}>
                    {this.props.product.name}
                    {this.getExtraAttributes()}
                    {this.getComment()}
                </div>
                <div className="checkout-item-right">
                    <p className="checkout-item-total-price">€{parseFloat(this.getPrice()).toFixed(2)}</p>
                </div>
            </div>
        );
    }
}
CheckoutProductBase.contextType = ThemeContext;

const CheckoutProduct = compose(
    withRouter,
)(CheckoutProductBase);

export default CheckoutProduct;