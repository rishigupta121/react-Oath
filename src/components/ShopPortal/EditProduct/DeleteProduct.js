import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import DATABASE from "../../Database";
import SelectProduct from "./SelectProduct";

class DeleteProductBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productId: '',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        var name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div>
                <SelectProduct setProduct={(productId) => this.setProduct(productId)}
                               currentRestaurantId={this.props.currentRestaurantId}/>
                <button className="btn btn-raised btn-primary" type="button"
                        onClick={() => this.deleteProduct()}>Delete Product
                </button>
            </div>
        );
    }

    deleteProduct() {
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + this.props.currentRestaurantId + '/products/' + this.state.productId).remove();
    }

    setProduct(productId){
        this.setState({productId: productId});
    }
}

const DeleteProduct = compose(
    withRouter,
    withFirebase,
)(DeleteProductBase);

export default DeleteProduct;