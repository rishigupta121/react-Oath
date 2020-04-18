import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";
import DATABASE from "../../Database";
import * as ROUTES from "../../../constants/routes";

class FetchMenuBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSubmit() {
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + this.props.restaurantId + '/pos/').on('value', snapshot => {
            var username = snapshot.val().username;
            var password = snapshot.val().password;
            var type = snapshot.val().type;
            console.log("Fetching menu");
            var xhr = new XMLHttpRequest();
            xhr.addEventListener('load', () => {
                console.log(xhr.responseText)
            });
            xhr.open('GET', 'http://pos.order-me.nu/pos/products/update/?restaurantId=' + this.props.restaurantId);
            xhr.send()
        });
    }

    render() {
        return (
            <div>
                <p>It can take a few minutes up to a hour before the new menu is loaded, depending on how much products you have.</p>
                <button className="btn btn-raised btn-primary" onClick={() => this.handleSubmit()}>Fetch menu
                </button>
            </div>
        );
    }
}

const FetchMenu = compose(
    withRouter,
    withFirebase,
)(FetchMenuBase);

export default FetchMenu;