import React from "react";
import {compose} from "recompose";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import DATABASE from "../../Database";
import * as ROUTES from "../../../constants/routes";

class AddPrinterBase extends React.Component {
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
        var path = DATABASE + "/printers/";
        if (this.validateData(macInput)) {
            this.props.firebase.db.ref(path + macInput).once('value', snapshot => {
                var restaurants = snapshot.val();
                if (restaurants) {
                    alert(macInput + " already exists for another restaurant.");
                } else {
                    var printer = {
                    };
                    printer[macInput] = this.props.currentRestaurantId;
                    this.props.firebase.db.ref(path).update(printer);
                    alert("Printer successfully added!")
                }
            });
        } else {
            alert(this.state.mac + " is not a valid MAC address.");
        }
    }

    validateData(mac) {
        var regex = /^(([A-Fa-f0-9]{2}[:]){5}[A-Fa-f0-9]{2}[,]?)+$/;
        return regex.test(mac);
    }

    render() {
        return (
            <div className="m-3">
                <h4 className="generate-qr mt-5">Add printer</h4>
                <div className="card">
                    <div className="card-body">
                        <form>
                            <div className="md-form">
                                <label>
                                    MAC address:
                                    <input type="text" name="mac" value={this.state.mac} onChange={this.handleChange}
                                           className="form-control"/>
                                </label>
                            </div>
                        </form>
                        <button className="btn btn-raised btn-primary" onClick={() => this.handleSubmit()}>Add printer
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const AddPrinter = compose(
    withRouter,
    withFirebase,
)(AddPrinterBase);

export default AddPrinter;