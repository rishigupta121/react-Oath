import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import DATABASE from "../../Database";

class SelectProductBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productId: '',
            products: [],
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + this.props.currentRestaurantId + '/products').on('value', snapshot => {
            this.setState({
                products: snapshot.val()
            });
        });
    }

    handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({
            [name]: value
        });

        this.props.setProduct(value);
    }

    getProductsAsOptions() {
        var productList = [];
        productList.push(
            <option key="-1" value="">Select Product</option>
        );
        for (var key in this.state.products) {
            var product = this.state.products[key];
            productList.push(
                <option key={product.id} value={product.id}>{product.name}</option>
            );
        }
        return productList;
    }

    render() {
        return (
            <div>
                <label>
                    Product you want to edit:
                    <select className="browser-default custom-select mt-2 mb-2" name="productId"
                            value={this.state.productId} onChange={this.handleChange}>
                        {this.getProductsAsOptions()}
                    </select>
                </label>
            </div>
        );
    }
}

const SelectProduct = compose(
    withRouter,
    withFirebase,
)(SelectProductBase);

export default SelectProduct;