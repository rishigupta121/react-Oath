import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import DATABASE from "../../Database";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import MoveProductToCategory from "./MoveProductToCategory";
import DeleteCategory from "./DeleteCategory";
import ChangeOrderOfCategory from "./ChangeOrderOfCategory";

class CategoryWrapperBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: '',
            products: '',
        };
    }

    render() {
        return (
            <div className="m-3">
                <AddCategory categories={this.state.categories} restaurantId={this.props.currentRestaurantId}/>
                <EditCategory categories={this.state.categories} restaurantId={this.props.currentRestaurantId}/>
                <MoveProductToCategory categories={this.state.categories} products={this.state.products}
                                       restaurantId={this.props.currentRestaurantId}/>
                <ChangeOrderOfCategory categories={this.state.categories} products={this.state.products}
                                       restaurantId={this.props.currentRestaurantId}/>
                <DeleteCategory categories={this.state.categories} restaurantId={this.props.currentRestaurantId}/>
            </div>
        );
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

    loadData(){
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + this.props.currentRestaurantId + '/categories').on('value', snapshot => {
            this.setState({
                categories: snapshot.val()
            });
        });
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + this.props.currentRestaurantId + '/products').on('value', snapshot => {
            this.setState({
                products: snapshot.val()
            });
        });
    }
}

const CategoryWrapper = compose(
    withRouter,
    withFirebase,
)(CategoryWrapperBase);

export default CategoryWrapper;