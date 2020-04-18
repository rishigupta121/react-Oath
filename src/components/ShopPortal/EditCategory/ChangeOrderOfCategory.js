import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import DATABASE from "../../Database";

const SortableItem = SortableElement(({value, sortIndex}) => <li className="card mt-1 mb-1 p-3">#{sortIndex+1} {value.name}</li>);

const SortableList = SortableContainer(({items}) => {
    return (
        <ul className="no-margins">
            {items.map((value, index) => (
                <SortableItem key={`item-sortable-${value.id}`} index={index} value={value}
                              sortIndex={index} />
            ))}
        </ul>
    );
});

class ChangeOrderOfCategoryBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productId: '',
            categoryId: '',
            categories: '',
            categories2: [{name: 'Burger', id: '123asc'}, {name: 'Cola', id: 'asdvubsadv83e'}, {name: 'Test', id: 'asdoviasdv8'}],
        };
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState(({categories}) => ({
            categories: arrayMove(categories, oldIndex, newIndex),
        }));
    };

    sortCategories(categories){
        let categoryList = [];
        for (let key in categories) {
            let category = categories[key];
            categoryList.push(category);
        }
        console.log(categoryList);
        return categoryList.sort(function(a,b) {return (a.orderingNumber > b.orderingNumber) ? 1 : ((b.orderingNumber > a.orderingNumber) ? -1 : 0);} );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.categories !== this.props.categories) {
            console.log(this.props.categories);
            let categories = this.sortCategories(this.props.categories);
            this.setState({categories: categories});
        }
    }

    handleSubmit() {
        for (let index in this.state.categories) {
            let category = this.state.categories[index];
            var path = DATABASE + "/restaurants/" + this.props.restaurantId + "/categories/" + category.id + "/orderingNumber";
            console.log(category.name + " set " + index);
            this.props.firebase.db.ref(path).set(index);
        }
    }

    render() {
        return (
            <div className="mt-5">
                <h4>
                    Change order of categories
                </h4>
                <div className="card">
                    <div className="card-body">
                        {this.state.categories ? <SortableList items={this.state.categories} onSortEnd={this.onSortEnd} /> : ''}
                        <button className="btn btn-raised btn-primary" onClick={() => this.handleSubmit()}>Update new
                            order
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const ChangeOrderOfCategory = compose(
    withRouter,
    withFirebase,
)(ChangeOrderOfCategoryBase);

export default ChangeOrderOfCategory;
