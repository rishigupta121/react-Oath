import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import DATABASE from "../../Database";

class RegisterAsRestaurantOwner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userId: '', userName: '', restaurantId: ''};
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.props.firebase.auth.onAuthStateChanged(user => {
            this.setState({userId: user.uid});
        });
    }

    validateData(state) {
        if (state.userName === '') {
            return "No name specified";
        }
        if (state.restaurantId === '') {
            return "No name specified";
        }
        if (state.userId === '') {
            return "No user id found";
        }
        return '';
    }

    handleSubmit() {
        var errorMessage = this.validateData(this.state);
        if (errorMessage !== '') {
            alert(errorMessage);
            return;
        }
        var restaurantId = this.state.restaurantId;
        var path = DATABASE + "/restaurantOwners/" + this.state.userId;
        this.props.firebase.db.ref(path).set({
            name: this.state.userName,
            currentRestaurant: restaurantId
        }).then(promise => {
            this.props.firebase.db.ref(path + '/restaurants/' + restaurantId).set(restaurantId).then(promise => {
                // TODO location.reload();
            });
        });
    }


    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {
        return (
            <div className="m-3">
                <h4>
                    Register as restaurant owner
                </h4>
                <div>
                    <form>
                        <label className="width-100">
                            Your name:
                            <input className="form-control" type="text" name="userName"
                                   value={this.state.userName}
                                   onChange={this.handleChange}/>
                        </label>
                        <br/>
                        <label className="width-100">
                            Unique identifier of the restaurant:
                            <input className="form-control" type="text" name="restaurantId"
                                   value={this.state.restaurantId}
                                   onChange={this.handleChange}/>
                        </label>
                    </form>
                    <button className="btn btn-raised btn-primary" type="button"
                            onClick={() => this.handleSubmit()}>Confirm
                    </button>
                </div>
            </div>
        );
    }
}


const RegisterAsRestaurantOwnerPage = compose(
    withRouter,
    withFirebase,
)(RegisterAsRestaurantOwner);

export default RegisterAsRestaurantOwnerPage;
