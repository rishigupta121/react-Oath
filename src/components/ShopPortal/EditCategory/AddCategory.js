import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import DATABASE from "../../Database";

class AddCategoryBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            startTime: '9:00',
            endTime: '24:00',
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
    }

    handleSubmit() {
        var errorMessage = this.validateData(this.state);
        if (errorMessage !== '') {
            alert(errorMessage);
            return;
        }
        var path = DATABASE + "/restaurants/" + this.props.restaurantId + "/categories/";
        var key = this.props.firebase.db.ref().child(path).push().key;
        this.props.firebase.db.ref(path + key).set({
            name: this.state.name,
            id: key,
            description: this.state.description,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
        }).then( error => {
            this.setState({
                name: '',
                description: '',
                startTime: '9:00',
                endTime: '24:00',
            });
        });
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
        if (!this.props.restaurantId) {
            return "No restaurant id specified";
        }
        return '';
    }

    render() {
        return (
            <div id="add-category">
                <h4>
                    Add Category
                </h4>
                <div className="card">
                    <div className="card-body">
                        <form>
                            <div className="md-form">
                                <label>
                                    Name:
                                    <input type="text" name="name" value={this.state.name} onChange={this.handleChange}
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
                                    <input placeholder="Selected time" type="text" id="input_starttime"
                                           value={this.state.startTime}
                                           name="startTime"
                                           onChange={this.handleChange}
                                           className="form-control timepicker"/>
                                </label>
                                <label className="width-80px ml-2">
                                    End time:
                                    <input placeholder="Selected time" type="text" id="input_endtime"
                                           value={this.state.endTime}
                                           name="endTime"
                                           onChange={this.handleChange}
                                           className="form-control timepicker"/>
                                </label>
                            </div>
                        </form>
                        <button className="btn btn-raised btn-primary" onClick={() => this.handleSubmit()}>Create
                            Category
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const AddCategory = compose(
    withRouter,
    withFirebase,
)(AddCategoryBase);

export default AddCategory;