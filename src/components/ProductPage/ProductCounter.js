import React from "react";
import { ReactComponent as MinusLogo } from '../../img/minus.svg';
import { ReactComponent as PlusLogo } from '../../img/add.svg';
import {ThemeContext} from "../ThemeContext";

class ProductCounter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: this.props.count,
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.count !== this.props.count) {
            this.setState({count : this.props.count});
        }
    }

    onClick(value) {
        var newValue = this.state.count + value;
        if (newValue < 0) {
            newValue = 0;
        }
        this.setState({count: newValue}, this.props.updateCount(newValue));
    }

    render() {
        return (
            <div className="row counter mt-2">
                <span className="" onClick={() => this.onClick(-1)}><MinusLogo alt="minus" height="25px" width="25px" fill={this.context.primaryColor}/></span>
                <h4 className="font-weight-bold counter">{this.state.count}</h4>
                <span className="" onClick={() => this.onClick(1)}><PlusLogo alt="add" height="25px" width="25px"  fill={this.context.primaryColor}/></span>
            </div>
        );
    }
}
ProductCounter.contextType = ThemeContext;

export default ProductCounter;