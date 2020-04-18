import React from "react";
import {compose} from 'recompose';
import {withFirebase} from '../Firebase';
import {withRouter} from 'react-router-dom';
import DATABASE from "../Database";
import ProductComment from "./ProductComment";
import ExtraProductAttributes from "./ExtraProductAttributes";
import ProductCounter from "./ProductCounter";
import AddProductButton from "./AddProductButton";
import * as ROUTES from "../../constants/routes";

class ProductPageBase extends React.Component {
    constructor(props) {
        super(props);
        if (!this.props.location.state || !this.props.location.state.product) {
            this.state = {noProduct: true};
            return;
        }
        var previousPage;
        var url = new URL(window.location.href);
        var tableNumber = atob(url.searchParams.get("tn"));
        var restaurantId = url.searchParams.get("restaurantId");
        var shoppingId = this.props.firebase.db.ref().child(DATABASE + '/restaurants/' + restaurantId + '/shoppingLists/' + tableNumber + '/products/').push().key;
        var count = 1;
        if (this.props.location.state) {
            if (this.props.location.state.previousPage) {
                previousPage = this.props.location.state.previousPage;
            } else {
                previousPage = ROUTES.LANDING;
            }
            if (this.props.location.state.shoppingId) {
                shoppingId = this.props.location.state.shoppingId;
            }
        }

        this.state = {
            noProduct: false,
            product: this.props.location.state.product,
            count: count,
            comment: '',
            extraAttributes: [],
            previousPage: previousPage,
            shoppingId: shoppingId,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        console.log("didm start");
        var url = new URL(window.location.href);
        var tableNumber = atob(url.searchParams.get("tn"));
        var restaurantId = url.searchParams.get("restaurantId");
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId + '/shoppingLists/' + tableNumber + '/products/' + this.state.shoppingId).on('value', snapshot => {
           var shoppingItem;
           console.log("didm load");
            if (snapshot.val()) {
                console.log(snapshot.val());
                shoppingItem = snapshot.val();
                this.setState({
                    count: shoppingItem.count,
                    comment: shoppingItem.comment,
                    extraAttributes: shoppingItem.extraAttributes ? shoppingItem.extraAttributes : [],
                });
                console.log("count: " + shoppingItem.count);
            }
        });

        const item = document.getElementById("product-image");
        if (item) {
            item.scrollIntoView();
        }
    }

    handleChange(event) {
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (name === "extraAttributes") {
            let extraAttributes = this.state.extraAttributes;
            extraAttributes[target.id] = value;
            value = extraAttributes;
        }

        this.setState({
            [name]: value
        });
    }

    getTotalPrice() {
        var productPrice = parseFloat(this.state.product.price);
        if (this.state.product.hasOwnProperty('extraAttributes')) {
            for (var key in this.state.product.extraAttributes) {
                if (this.state.extraAttributes.hasOwnProperty(key) && this.state.extraAttributes[key]) {
                    let attribute = this.state.product.extraAttributes[key];
                    if (attribute.increase) {
                        productPrice += parseFloat(attribute.priceDifference);
                    } else {
                        productPrice -= parseFloat(attribute.priceDifference);
                    }
                }
            }
        }
        var totalPrice = productPrice * this.state.count;
        return totalPrice.toFixed(2);
    }

    updateProduct(product) {
        this.setState({
            product: product
        });
    }

    updateCount(count) {
        this.setState({
            count: count
        });
    }

    addProduct() {
        var url = new URL(window.location.href);
        var tableNumber = atob(url.searchParams.get("tn"));
        var restaurantId = url.searchParams.get("restaurantId");
        console.log(this.state);
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId + '/shoppingLists/' + tableNumber + '/products/' + this.state.shoppingId).set({
            productId: this.state.product.id,
            count: this.state.count,
            comment: this.state.comment,
            extraAttributes: this.state.extraAttributes,
        }).then(promise => {
            this.props.history.push({
                pathname: this.state.previousPage,
                search: this.props.location.search,
                state: {'restoreProduct': this.state.product.id},
            });
        });
    }

    loadExtraAttribute() {
        if (this.state.product.hasOwnProperty('extraAttributes')) {
            for (var key in this.state.product.extraAttributes) {
                if (!this.state.extraAttributes.hasOwnProperty(key)) {
                    this.state.extraAttributes[key] = false;
                }
            }
            return <ExtraProductAttributes attributes={this.state.product.extraAttributes}
                                           selectedAttributes={this.state.extraAttributes}
                                           handleChange={(event) => this.handleChange(event)}/>;
        }
    }

    onClickCancel() {
        console.log(this.state.previousPage);
        this.props.history.push({
            pathname: this.state.previousPage,
            search: this.props.location.search,
            state: {'restoreProduct': this.props.productId},
        });
    }

    render() {
        if (this.state.noProduct) {
            return 'There is no product to display';
        }
        return (
            <div id="product-view">
                <div className="product-detail-wrapper">
                    <img className="product-image" id="product-image" src={this.state.product.imageUrl}/>
                    <div className="product-detail">
                        <h5 className="card-name">{this.state.product.name}</h5>
                        <span
                            className="card-description-product-page text-grey w-100">{this.state.product.description}</span>
                        {this.loadExtraAttribute()}
                        <ProductComment comment={this.state.comment}
                                        handleChange={(event) => this.handleChange(event)}/>
                        <ProductCounter product={this.state.product} count={this.state.count}
                                        updateCount={(i) => this.updateCount(i)}/>
                        <br/>
                    </div>
                    <div className="height-100"></div>
                    <AddProductButton productId={this.state.product.id} price={this.getTotalPrice()}
                                      addProduct={(event) => this.addProduct(event)}
                                      cancel={() => this.onClickCancel()}/>
                </div>
            </div>
        );
    }
}


const ProductPage = compose(
    withRouter,
    withFirebase,
)(ProductPageBase);

export default ProductPage;