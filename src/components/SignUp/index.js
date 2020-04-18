import React from "react";
import {compose} from 'recompose';
import {withFirebase} from '../Firebase';
import * as ROUTES from "../../constants/routes";

const SignUpPage = () => (
    <Index/>
);

class SignUpBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password1: '', password2: ''};

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
        if (this.state.password1 === '') {
            return "No password specified";
        }
        if (this.state.password2 !== this.state.password1) {
            return "Passwords are not equal";
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
        var password = this.state.password1;

        this.props.firebase.auth.createUserWithEmailAndPassword(email, password).then(snap => {
            this.props.firebase.auth.signInWithEmailAndPassword(email, password).then(snap => {
                console.log("login succeeded");
                this.props.history.push({
                    pathname: ROUTES.LANDING,
                    search: this.props.location.search,
                });
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
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
            <div>
                <h3>Signup</h3>
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
                                <input className="form-control" type="password" name="password1"
                                       value={this.state.password1}
                                       onChange={this.handleInputChange}/>
                            </label>
                            <br/>
                            <label>
                                password again:
                                <input className="form-control" type="password" name="password2"
                                       value={this.state.password2}
                                       onChange={this.handleInputChange}/>
                            </label>
                            <br/>
                        </form>
                        <button className="btn btn-raised btn-primary" onClick={() => this.handleSubmit()}>Create
                            Account
                        </button>
                    </div>
                </div>
                <br/>
                <label>
                    //TODO fix this now
                    {/*Already an account? <a className="text-primary" onClick={() => loadLogin()}>Login</a>*/}
                </label>
            </div>
        );
    }
}

const Index = compose(
    withFirebase,
)(SignUpBox);

export default SignUpPage;