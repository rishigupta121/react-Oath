import React from "react";
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';
import {withFirebase} from '../Firebase';
import * as ROUTES from '../../constants/routes';

class LogInBox extends React.Component {
    constructor(props) {
        super(props);
        console.log("login const");
        this.state = {email: '', password: ''};
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        this.setState({
            [target.name]: target.value
        });
    }

    validateData() {
        if (this.state.email === '') {
            return "No email specified";
        }
        if (this.state.password === '') {
            return "No password specified";
        }
        return '';
    }

    handleSubmit() {
        var errorMessage = this.validateData();
        if (errorMessage !== '') {
            alert(errorMessage);
            return;
        }
        var email = this.state.email;
        var password = this.state.password;

        this.props.firebase.auth.signInWithEmailAndPassword(email, password).then(authUser => {
            // user signed in
            let page = ROUTES.LANDING;
            if (this.props.location.state && this.props.location.state.lastPage) {
                page = this.props.location.state.lastPage;
            }
            this.props.history.push({
                pathname: page,
                search: this.props.location.search,
                state: {loggedIn : true}
            });
        }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
    }

    render() {
        return (
            <div className="m-4">
                <h3>Login</h3>
                <div className="card">
                    <div className="card-body">
                        <form>
                            <label>
                                Email:
                                <input className="form-control" type="text" name="email" value={this.state.email}
                                       onChange={this.handleInputChange}/>
                            </label>
                            <br/>
                            <label>
                                password:
                                <input className="form-control" type="password" name="password"
                                       value={this.state.password}
                                       onChange={this.handleInputChange}/>
                            </label>
                            <br/>
                        </form>
                        <button className="btn btn-raised btn-primary" onClick={() => this.handleSubmit()}>Login
                        </button>
                    </div>
                </div>
                <br/>
                {/*<label>*/}
                {/*    No account? <a className="text-primary" onClick={() => loadSignUp()}>Sign up</a>*/}
                {/*</label>*/}
            </div>
            // <h4>Plaats een bestelling voor tafel {this.props.tableNumber} van de {this.props.restaurantName}</h4>
        );
    }
}

const LogInPage = compose(
    withRouter,
    withFirebase,
)(LogInBox);

export default LogInPage;