import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import DATABASE from "../../Database";
import * as ROUTES from "../../../constants/routes";

class AddKeyBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        var path = DATABASE + "/restaurants/" + this.props.restaurantId + "/pos/";
        this.props.firebase.db.ref(path).on('value', snapshot => {
            if(snapshot.val() != null) {
                this.setState({
                    username: snapshot.val().username,
                    password: snapshot.val().password
                });
            } else {
                this.setState({
                    username: '',
                    password: ''
                });
            }
        });
    }

    handleSubmit() {
        var path = DATABASE + "/restaurants/" + this.props.restaurantId + "/pos/";

        if(this.state.username === ""){
            this.props.firebase.db.ref(path).remove();
        }else{
            var pos = {
                username: this.state.username,
                password: this.state.password,
                type: 'untill'
            };
            this.props.firebase.db.ref(path).update(pos).then(snapshot => {
                this.props.history.push({
                    pathname: ROUTES.SHOP_PORTAL
                });
                alert("Untill username and password succesfully added!");
            });
        }
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
            <div>
                <form>
                <label className="width-100">
                    Username: <input className="form-control" type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
                </label>
                    <label className="width-100">
                        Password: <input className="form-control" type="text" name="password" value={this.state.password} onChange={this.handleChange}/>
                    </label>
                </form>
                <button className="btn btn-raised btn-primary" onClick={() => this.handleSubmit()}>Save key
                </button>
            </div>
        );
    }
}

const AddKey = compose(
    withRouter,
    withFirebase,
)(AddKeyBase);

export default AddKey;