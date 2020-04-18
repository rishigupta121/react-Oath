import React from "react";
import {compose} from "recompose";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import qrcode from "qrcode-generator";

class GenerateQR extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTableNumber: 1,
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

    render() {
        return (
            <div className="m-3">
                <h4 className="generate-qr mt-5">Generate QR codes</h4>
                <div className="card">
                    <div className="card-body">
                        <form>
                            <div className="md-form">
                                <label>
                                    Table number:
                                    <input type="text" name="currentTableNumber" value={this.state.currentTableNumber} onChange={this.handleChange}
                                           className="form-control"/>
                                </label>
                            </div>
                        </form>
                        <button className="btn btn-raised btn-primary" onClick={() => this.createQRCode(this.state.currentTableNumber, this.props.currentRestaurantId)}>Download QR
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    createQRCode(tableNumber, restaurantId) {
        var qr = qrcode(0, 'M');
        qr.addData("http://" + window.location.hostname+(window.location.port ? ':'+ window.location.port: '') + '/?tn=' + btoa(tableNumber) + '&restaurantId=' + restaurantId);
        console.log("http://" + window.location.hostname+(window.location.port ? ':'+ window.location.port: '') + '/?tn=' + btoa(tableNumber) + '&restaurantId=' + restaurantId);
        qr.make();

        var a = document.createElement('a');
        a.href = qr.createDataURL(32);
        a.download = "QR-" + restaurantId + "-table" + tableNumber + ".png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

const GenerateQRPage = compose(
    withRouter,
    withFirebase,
)(GenerateQR);

export default GenerateQRPage;