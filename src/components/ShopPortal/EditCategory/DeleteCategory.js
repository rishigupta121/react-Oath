import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import DATABASE from "../../Database";

class DeleteCategoryBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryId: '',
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
            <div id="delete-category" className="mt-5">
                <h4>
                    Delete Category
                </h4>
                <div className="card">
                    <div className="card-body">
                        <form>
                            <div className="md-form">
                                <label>
                                    Select category to edit:
                                    <select className="browser-default custom-select mt-2 mb-2" name="categoryId"
                                            value={this.state.categoryId} onChange={this.handleChange}>
                                        {this.getCategoriesAsOptions()}
                                    </select>
                                </label>
                            </div>
                        </form>
                        <button className="btn btn-raised btn-primary" type="button"
                                onClick={() => this.deleteCategory()}>Delete Category
                        </button>
                    </div>
                </div>
            </div>
        );
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

    deleteCategory() {
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + this.props.restaurantId + '/categories/' + this.state.categoryId).remove();

        this.props.firebase.db.ref(DATABASE + '/restaurants/' + this.props.restaurantId + '/products/').on('value', snapshot => {
            var products = snapshot.val();

            for (var productId in products) {
                if (products[productId].categoryId === this.state.categoryId) {
                    this.props.firebase.db.ref(DATABASE + '/restaurants/' + this.props.restaurantId + '/products/' + productId + '/categoryId').set('');
                }
            }
        });
    }
}

const DeleteCategory = compose(
    withRouter,
    withFirebase,
)(DeleteCategoryBase);

export default DeleteCategory;