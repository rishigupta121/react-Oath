import React from "react";
import DATABASE from "../Database";
import {withFirebase} from '../Firebase';
import {compose} from "recompose";
import {ReactComponent as BillLogo} from '../../img/bill.svg';
import {ThemeContext} from "../ThemeContext";
import * as ROUTES from "../../constants/routes";

class WaiterButtonBase extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            restaurantHasPos: false,
            restaurantHasPrinter: false
        };
    }

    callWaiter() {
        if (window.confirm('Do you really want to pay?')) {
            document.getElementById('callwaiter-button').disabled = 'disabled';

            var url = new URL(window.location.href);
            var tableNumber = url.searchParams.get("tableNumber");
            var restaurantId = url.searchParams.get("restaurantId");

            this.props.firebase.db.ref(DATABASE + '/printers/').on('value', snapshot => {
                var printers = snapshot.val();
                var macs = Object.keys(printers);
                var macsOfThisRestaurant = [];
                for (var i = 0; i < macs.length; i++) {
                    if (printers[macs[i]] === restaurantId) {
                        macsOfThisRestaurant.push(macs[i]);
                    }
                }

                for (i = 0; i < macsOfThisRestaurant.length; i++) {
                    var newPostKey = this.props.firebase.db.ref().child(DATABASE + '/restaurants/' + restaurantId + "/print-jobs/").push().key;
                    this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId + "/print-jobs/" + newPostKey).set({
                        text: "Notify waiter to pay bill for table " + tableNumber,
                        type: "notify_waiter",
                        id: newPostKey,
                        printer: macsOfThisRestaurant[i]
                    });
                }
                alert("A waiter is notified");
            });
        }
    }

    componentDidMount() {
        var url = new URL(window.location.href);
        var restaurantId = url.searchParams.get("restaurantId");
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId + '/pos/type').on('value', snapshot => {
            if (snapshot.val()) {
                if (snapshot.val() === "untill") {
                    this.setState({restaurantHasPos: true});
                }
            }
        });

        this.props.firebase.db.ref(DATABASE + '/printers/').on('value', snapshot => {
            var printers = snapshot.val();
            var macs = Object.keys(printers);
            var macsOfThisRestaurant = [];
            for (var i = 0; i < macs.length; i++) {
                if (printers[macs[i]] === restaurantId) {
                    macsOfThisRestaurant.push(macs[i]);
                }
            }
            console.log(macsOfThisRestaurant);
            this.setState({restaurantHasPrinter: macsOfThisRestaurant.length > 0});
        });
    }

    render() {
        let theme = this.context;
        if (this.state.restaurantHasPrinter) {
            if (this.state.restaurantHasPos) {
                return (
                    <div className="">
                        <button className="col-10 cancel-button mt-2" id="callwaiter-button" onClick={() => this.callWaiter()}>Call waiter to
                            pay
                            the
                            bill!
                        </button>
                        <div className="col-2 mt-2" id="bill-wrapper">
                            <BillLogo height="40px" width="40px" id="bill-logo"
                                      onClick={() => this.props.openBillPage()}
                                      fill={theme.primaryColor}/>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="">
                        <button className="col-12 cancel-button mt-2" id="callwaiter-button" onClick={() => this.callWaiter()}>Call waiter to
                            pay
                            the
                            bill!
                        </button>
                    </div>
                );
            }
        } else {
            if (this.state.restaurantHasPos) {
                return (
                    <div className="">
                        <div className="col-2 mt-2" id="bill-wrapper">
                            <BillLogo height="40px" width="40px" id="bill-logo"
                                      onClick={() => this.props.openBillPage()}
                                      fill={theme.primaryColor}/>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="">
                    </div>
                );
            }
        }
    }
}

WaiterButtonBase.contextType = ThemeContext;
const WaiterButton = compose(
    withFirebase,
)(WaiterButtonBase);

export default WaiterButton;
