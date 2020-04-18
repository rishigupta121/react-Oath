import React from "react";

class OrderButton extends React.Component {
    render() {
        return (
            <div className="">
                <button className="order-button" onClick={() => this.props.openCheckout()}>
                    <div className="w-100">
                        <div className="box top-padding-2 ml-2">
                            {this.props.totalCount}
                        </div>
                        <div className="top-padding-3 order-price mr-2">€{parseFloat(this.props.price).toFixed(2)}</div>
                    </div>
                    <div className=" order-me-button w-100">View OrderMe</div>
                </button>
            </div>
        );
    }
}

export default OrderButton;
