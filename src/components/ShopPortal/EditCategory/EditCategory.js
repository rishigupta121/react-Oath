import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import DATABASE from "../../Database";

class EditCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryId: '',
            name: '',
            description: '',
            startTime: '',
            endTime: '',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

        if (name === 'categoryId') {
            this.props.firebase.db.ref(DATABASE + '/restaurants/' + this.props.restaurantId + '/categories/' + value).on('value', snapshot => {
                this.setState({
                    name: snapshot.val().name,
                    description: snapshot.val().description,
                    startTime: snapshot.val().startTime,
                    endTime: snapshot.val().endTime,
                });
            });
        }
    }

    handleSubmit() {
        var errorMessage = this.validateData(this.state);
        if (errorMessage !== '') {
            alert(errorMessage);
            return;
        }
        var path = DATABASE + "/restaurants/" + this.props.restaurantId + "/categories/" + this.state.categoryId;
        this.props.firebase.db.ref(path).set({
            name: this.state.name,
            id: this.state.categoryId,
            description: this.state.description,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
        }).then(error => {
            this.setState({
                categoryId: '',
                name: '',
                description: '',
                startTime: '',
                endTime: '',
            });
        });
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
        if (state.name === '') {
            return "No name specified";
        }
        let trimName = state.name;
        trimName = trimName.trim();
        if (trimName.length !== state.name.length) {
            return "Invalid name (should not contain leading or trailing spaces)";
        }
        if (state.description === '') {
            return "No description specified";
        }
        var startTimes = state.startTime.split(":");
        if (!state.startTime.includes(":") || state.startTime.length > 5 || isNaN(startTimes[0]) || isNaN(startTimes[1])) {
            return "Start time specified not valid (time should look like 09:00)";
        }
        var endTimes = state.endTime.split(":");
        if (!state.endTime.includes(":") || state.endTime.length > 5 || isNaN(endTimes[0]) || isNaN(endTimes[1])) {
            return "End time specified not valid (time should look like 09:00)";
        }
        return '';
    }

    render() {
        return (
            <div id="edit-category" className="mt-5">
                <h4>
                    Edit Category
                </h4>
                <div className="card">
                    <div className="card-body">
                        <div>
                            <form>
                                <div className="md-form">
                                    <label>
                                        Select category to edit:
                                        <select className="browser-default custom-select mt-2 mb-2" name="categoryId"
                                                value={this.state.categoryId} onChange={this.handleChange}>
                                            {this.getCategoriesAsOptions()}
                                        </select>
                                    </label>
                                    <br/>
                                    <label>
                                        Name:
                                        <input type="text" name="name" value={this.state.name}
                                               onChange={this.handleChange}
                                               className="form-control"/>
                                    </label>
                                    <br/>
                                    <label>
                                        Short description:
                                        <input type="text" name="description" value={this.state.description}
                                               className="form-control"
                                               onChange={this.handleChange}/>
                                    </label>
                                    <br/>
                                    <label className="width-80px">
                                        Start time:
                                        <input placeholder="09:00" type="text" id="input_starttime"
                                               value={this.state.startTime}
                                               name="startTime"
                                               onChange={this.handleChange}
                                               className="form-control timepicker"/>
                                    </label>
                                    <label className="ml-2 width-80px">
                                        End time:
                                        <input placeholder="18:00" type="text" id="input_endtime"
                                               value={this.state.endTime}
                                               name="endTime"
                                               onChange={this.handleChange}
                                               className="form-control timepicker"/>
                                    </label>
                                </div>
                            </form>
                            <button className="btn btn-raised btn-primary" onClick={() => this.handleSubmit()}>Update
                                Category
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const EditCategoryPage = compose(
    withRouter,
    withFirebase,
)(EditCategory);

export default EditCategoryPage;