import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import DATABASE from "../../Database";
import ProductInputFields from "./ProductInputFields";
import DeleteProduct from "./DeleteProduct";

class ProductWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: '',
        };
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        if(this.props.currentRestaurantId !== prevProps.currentRestaurantId)
        {
            this.loadData();
        }
    }

    loadData() {
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + this.props.currentRestaurantId + '/categories').on('value', snapshot => {
            this.setState({
                categories: snapshot.val()
            });
        });
    }

    render() {
        return (
            <div className="m-3">
                <h4>Add Product</h4>
                <div className="card">
                    <div className="card-body">
                        <ProductInputFields categories={this.state.categories} isEdit={false}
                                            currentRestaurantId={this.props.currentRestaurantId}/>
                    </div>
                </div>
                <h4 className="mt-5">Edit Product</h4>
                <div className="card">
                    <div className="card-body">
                        <ProductInputFields categories={this.state.categories} isEdit={true}
                                            currentRestaurantId={this.props.currentRestaurantId}/>
                    </div>
                </div>
                <h4 className="mt-5">Delete Product</h4>
                <div className="card">
                    <div className="card-body">
                        <DeleteProduct currentRestaurantId={this.props.currentRestaurantId}/>
                    </div>
                </div>
            </div>
        );
    }

}

const EditProductPage = compose(
    withRouter,
    withFirebase,
)(ProductWrapper);

export default EditProductPage;