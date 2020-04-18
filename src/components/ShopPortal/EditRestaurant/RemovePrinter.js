import React from "react";
import {compose} from "recompose";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import DATABASE from "../../Database";
import * as ROUTES from "../../../constants/routes";

class RemovePrinterBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mac: "",
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
        var macInput = this.state.mac.toLowerCase();

        if (this.validateData(macInput)) {
            this.props.firebase.db.ref(DATABASE + '/printers/' + macInput).remove();
            alert("Printer removed!");
        } else {
            alert(this.state.mac + " is not a valid MAC address.");
        }
    }

    validateData(mac) {
        var regex = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/;
        return regex.test(mac);
    }

    getPrintersOfRestaurant() {
        this.props.firebase.db.ref(DATABASE + '/printers/').on('value', snapshot => {
            var printers = snapshot.val();
            var macs = Object.keys(printers);

            var macsOfThisRestaurant = [];
            for(var i = 0; i < macs.length; i++) {
                if(printers[macs[i]] === this.props.currentRestaurantId) {
                    macsOfThisRestaurant.push(macs[i]);
                }
            }
        });
    }

    render() {
        return (
            <div className="m-3">
                <h4 className="generate-qr mt-5">Remove printer</h4>
                <div className="card">
                    <div className="card-body">
                        <form>
                            <div className="md-form">
                                <label>
                                    MAC address to remove:
                                    <input type="text" name="mac" value={this.state.mac} onChange={this.handleChange}
                                           className="form-control"/>
                                </label>
                            </div>
                        </form>
                        <button className="btn btn-raised btn-primary" onClick={() => this.handleSubmit()}>Remove printer
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const RemovePrinter = compose(
    withRouter,
    withFirebase,
)(RemovePrinterBase);

export default RemovePrinter;