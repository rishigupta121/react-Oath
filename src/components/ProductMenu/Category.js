import React from "react";
import Product from "./Product";

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shoppingList: this.props.shoppingList,
        };
    }

    getShoppingListCountForProduct(productId) {
        let count = 0;
        for (var key in this.state.shoppingList) {
            if (!this.state.shoppingList.hasOwnProperty(key)) {
                break;
            }
            if (productId === this.state.shoppingList[key].productId) {
                count += this.state.shoppingList[key].count;
            }
        }
        return count;
    }

    createProductList() {
        var html = [];
        for (var key in this.props.products) {
            if (!this.props.products.hasOwnProperty(key)) {
                break;
            }
            var item = this.props.products[key];
            var shopProductCount = this.getShoppingListCountForProduct(item.id);
            html.push(<li key={key}><Product shopProductCount={shopProductCount} product={item} clickable={true}/></li>);
        }
        return html;
    }

    render() {
        return (
            <div className="category">
                <div className="category-name">
                    <a name={this.props.category.name} className="category-anchor"></a>
                    <h4 className="ml-3 category-title mt-3 pt-3">{this.props.category.name}</h4>
                    <p className="ml-3 category-description pb-1">{this.props.category.description}</p>
                </div>
                <div className="product_list">
                    <ul className="list-unstyled">
                        {this.createProductList()}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Category;