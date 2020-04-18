import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import DATABASE from "../../Database";

class MoveProductToCategoryBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productId: '',
            categoryId: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    getProductsAsOptions() {
        var productList = [];
        productList.push(
            <option key="-1" value="">Select Product</option>
        );
        for (var key in this.props.products) {
            var product = this.props.products[key];
            productList.push(
                <option key={product.id} value={product.id}>{product.name}</option>
            );
        }
        return productList;
    }

    getCategoriesAsOptions() {
        var categoryList = [];
        categoryList.push(
            <option key="-1" value="-1">Select category</option>
        );
        for (var categoryId in this.props.categories) {
            var category = this.props.categories[categoryId];
            categoryList.push(
                <option key={category.id} value={category.id}>{category.name}</option>
            );
        }
        categoryList.push(
            <option key="none" value="">No category at all</option>
        );
        return categoryList;
    }

    validateData(state) {
        if (state.productId === '') {
            return "No product selected";
        }
        if (state.categoryId === '-1') {
            return "No category selected";
        }
        return '';
    }

    handleSubmit() {
        var state = this.state;
        var errorMessage = this.validateData(state);
        if (errorMessage !== '') {
            alert(errorMessage);
            return;
        }
        var path = DATABASE + "/restaurants/" + this.props.restaurantId + "/products/" + this.state.productId + "/categoryId";
        this.props.firebase.db.ref(path).set(state.categoryId).then( error => {
            this.setState ({
                productId: '',
                categoryId: ''
            });
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div className="mt-5">
                <h4>
                    Move product to category
                </h4>
                <div className="card">
                    <div className="card-body">
                        <form>
                            <label>
                                Product:
                                <select className="browser-default custom-select mt-2 mb-2" name="productId"
                                        value={this.state.productId} onChange={this.handleChange}>
                                    {this.getProductsAsOptions()}
                                </select>
                            </label>
                            <br/>
                            <label>
                                New category:
                                <select className="browser-default custom-select mt-2" name="categoryId"
                                        value={this.state.categoryId} onChange={this.handleChange}>
                                    {this.getCategoriesAsOptions()}
                                </select>
                            </label>
                        </form>
                        <button className="btn btn-raised btn-primary" onClick={() => this.handleSubmit()}>Apply
                            category
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const MoveProductToCategory = compose(
    withRouter,
    withFirebase,
)(MoveProductToCategoryBase);

export default MoveProductToCategory;
