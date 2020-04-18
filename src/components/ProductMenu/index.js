import React from "react";
import {compose} from 'recompose';
import {withFirebase} from '../Firebase';
import {withRouter} from 'react-router-dom';
import DATABASE from "../Database";
import OrderButton from "./OrderButton";
import {filterCategoriesOnTime} from '../HelperFunctions/FilterCategories';
import WaiterButton from "./WaiterButton";
import Category from "./Category";
import { ReactComponent as SearchIcon } from '../../img/search.svg';
import * as ROUTES from "../../constants/routes";

class Menu extends React.Component {
    constructor(props) {
        super(props);
        let restorePosition = '';
        if (this.props.location.state && this.props.location.state.restoreProduct) {
            restorePosition = this.props.location.state.restoreProduct
        }
        this.state = {
            categoryList: '',
            inputRef: React.createRef(),
            price: 0,
            orderedProducts: '',
            categories: '',
            allProducts: '',
            restorePosition: restorePosition,
            filteredOrderedProducts: '',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        let restorePosition = '';
        if (this.props.location.state && this.props.location.state.restoreProduct) {
            restorePosition = this.props.location.state.restoreProduct
        }
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
                count: this.getCount(shoppingList)
            });
        });
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId).once('value').then(snapshot => {
            if (!snapshot.hasChild('name') || !snapshot.hasChild('id')) {
                alert("There doesn't exist a restaurant for this url.");
                return;
            }
            var allProducts = snapshot.val().products;
            var categories = snapshot.val().categories;
            var filteredCategories = filterCategoriesOnTime(categories);
            //TODO delete shopping bag items that are not in filteredCategories?
            var orderedProducts = this.orderProducts(allProducts, filteredCategories);
            this.setState({
                orderedProducts: orderedProducts,
                categories: filteredCategories,
                allProducts: allProducts,
            });
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.restorePosition) {
            const element = document.getElementById(this.state.restorePosition);
            if (element) {
                this.setState({'restorePosition': ''});
                const elementRect = element.getBoundingClientRect();
                const absoluteElementTop = elementRect.top + window.pageYOffset;
                const middle = absoluteElementTop - (window.innerHeight / 3);
                window.scrollTo(0, middle);
            }
        }
    }

    sortCategories(categories) {
        return categories.sort(function (a, b) {
            return (a.orderingNumber > b.orderingNumber) ? 1 : ((b.orderingNumber > a.orderingNumber) ? -1 : 0);
        });
    }

    orderProducts(products, categories) {
        categories = this.sortCategories(categories);
        var orderedProducts = new Map();

        for (var categoryId in categories) {
            if (!categories.hasOwnProperty(categoryId)) {
                break;
            }
            var category = categories[categoryId];
            var productList = [];

            for (var productId in products) {
                if (!products.hasOwnProperty(productId)) {
                    break;
                }
                var product = products[productId];
                if (product.categoryId === category.id) {
                    product.count = 0;
                    productList.push(product);
                }
            }
            orderedProducts.set(category.id, productList);
        }
        return orderedProducts;
    }

    getCount(shoppingList) {
        var count = 0;
        for (var key in shoppingList) {
            var shoppingItem = shoppingList[key];
            count += shoppingItem.count;
        }
        return count;
    }

    getPrice(shoppingList, allProducts) {
        let totalPrice = 0;
        console.log(allProducts);
        for (let key in shoppingList) {
            let shoppingItem = shoppingList[key];
            let productId = shoppingItem.productId;
            console.log(productId);
            if (!allProducts.hasOwnProperty(productId)) {
                //TODO what if the product doesn't exist anymore?
                console.log("cannot find product with id " + productId);
                break;
            }
            var product = allProducts[productId];
            var productPrice = parseFloat(product.price);
            if (product.hasOwnProperty('extraAttributes') && shoppingItem.hasOwnProperty('extraAttributes')) {
                for (var keyExtraAttribute in product.extraAttributes) {
                    if (shoppingItem.extraAttributes.hasOwnProperty(keyExtraAttribute) && shoppingItem.extraAttributes[keyExtraAttribute]) {
                        let attribute = product.extraAttributes[keyExtraAttribute];
                        if (attribute.increase) {
                            productPrice += parseFloat(attribute.priceDifference);
                        } else {
                            productPrice -= parseFloat(attribute.priceDifference);
                        }
                    }
                }
            }
            totalPrice += shoppingItem.count * productPrice;
        }
        return totalPrice.toFixed(2);
    }

    getCategory(categoryId) {
        for (var key in this.state.categories) {
            if (!this.state.categories.hasOwnProperty(key)) {
                break;
            }
            var category = this.state.categories[key];
            if (categoryId === category.id) {
                return category;
            }
        }
    }

    createCategoryList(shoppingList, orderedProducts) {
        var categoryList = [];
        for (var [categoryId, products] of orderedProducts) {
            var category = this.getCategory(categoryId);
            // make id unique for every update
            var date = new Date();
            var timestamp = date.getTime();
            var key = categoryId + timestamp;
            var categoryHtml = <li key={key}><Category products={products} category={category}
                                                       shoppingList={shoppingList}/>
            </li>;
            categoryList.push(categoryHtml);
        }
        return categoryList;
    }

    handleChange(event) {
        let inputValue = event.target.value;
        if(!inputValue){
            this.setState({filteredOrderedProducts: ''})
            return;
        }
        var filteredOrderedProducts = new Map();

        for (let [categoryId, products] of this.state.orderedProducts) {
            let productList = [];
            for (let productKey in products) {
                if (!products.hasOwnProperty(productKey)) {
                    break;
                }
                let product = products[productKey];
                var similarityName = product.name.toLowerCase().includes(event.target.value.toLowerCase());
                var similarityDescription = false;
                if(product.description){
                    similarityDescription = product.description.toLowerCase().includes(event.target.value.toLowerCase());
                }

                if (similarityName || similarityDescription) {
                    productList.push(product);
                }
            }
            if (productList.length > 0) {
                filteredOrderedProducts.set(categoryId, productList);
            }
        }
        if (event.target.value) {
            this.setState({filteredOrderedProducts: filteredOrderedProducts})
        }
    }

    onClickSearchIcon(){
        this.state.inputRef.focus();
    }

    render() {
        return (
            <div id="menu">
                <div className="search-wrapper">
                    <SearchIcon id="search-icon" height="25px" width="25px" onClick={() => this.onClickSearchIcon()}/>
                    <input type="text"
                           ref={(input) => { this.state.inputRef = input; }}
                        placeholder="Search..."
                        onChange={this.handleChange}
                        id="search-input"
                    />
                </div>
                <div className="category-list">
                    <ul className="list-unstyled">
                        {this.createCategoryList(this.state.shoppingList,
                            this.state.filteredOrderedProducts ? this.state.filteredOrderedProducts : this.state.orderedProducts)
                        }
                    </ul>
                </div>
                <div className="pl-3 pr-3 pb-3 pt-3 double-button-wrapper fixed-buttons">
                    <OrderButton totalCount={this.state.count}
                                 price={this.getPrice(this.state.shoppingList, this.state.allProducts)}
                                 openCheckout={() => this.openCheckout()}/>
                    <WaiterButton openBillPage={() => this.openBillPage()}/>
                </div>
            </div>
        );
    }

    openBillPage(){
        this.props.history.push({
            pathname: ROUTES.BILL_PAGE,
            search: this.props.location.search,
        });
    }

    openCheckout() {
        this.props.history.push({
            pathname: ROUTES.CHECKOUT,
            search: this.props.location.search,
            state: {
                allProducts: this.state.allProducts,
            },
        });
    }
}

const ProductMenuPage = compose(
    withFirebase,
    withRouter,
)(Menu);

export default ProductMenuPage;
