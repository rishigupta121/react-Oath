import React from "react";
import {withFirebase} from "../../Firebase";
import {withRouter} from 'react-router-dom';
import {compose} from "recompose";

class AddExtraAtrributesBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputRef: React.createRef()
        };
    }

    extraAttributeIncreaseToText(increase) {
        if (increase) {
            return <span className="text-primary ml-1">Increase price</span>;
        } else {
            return <span className="text-primary ml-1">Decrease price</span>;
        }
    }

    componentDidUpdate() {
        // Set focus on last created add attribute
        if(this.props.addAttribute){
            this.state.inputRef.focus();
            this.props.resetAddExtraAttribute();
        }
    }

    loadAllExtraAttributes() {
        var attributesHtml = [];
        for (var key in this.props.extraAttributes) {
            if (!this.props.extraAttributes.hasOwnProperty(key)) {
                break;
            }
            var extraAttribute = this.props.extraAttributes[key];
            var extraAttributeHtml = <div className="mt-2 mb-2 p-3 border" key={key}>
                <label className="width-100">
                    Name: <input className="form-control" type="text" name="extraAttribute_name" id={key}
                                 value={extraAttribute.name} placeholder="No onions"
                                 ref={(input) => { this.state.inputRef = input; }}
                                 onChange={this.props.handleChange}/>
                </label>
                <label className="width-100 form-control">
                    <input type="checkbox"
                           name="extraAttribute_increase" id={key}
                           value={extraAttribute.increase}
                           checked={extraAttribute.increase}
                           onChange={this.props.handleChange}/>
                    {this.extraAttributeIncreaseToText(extraAttribute.increase)}
                </label>
                <label className="width-100">
                    Price Difference: <input className="form-control" type="text" name="extraAttribute_priceDifference"
                                             id={key} placeholder="0.50"
                                             value={extraAttribute.priceDifference}
                                             onChange={this.props.handleChange}/>
                </label>
            </div>;
            attributesHtml.push(extraAttributeHtml);
        }
        return attributesHtml;
    }

    render() {
        return (
            <div className="mt-3 mb-2">
                <label className="width-100 font-weight-bold"> Extra attributes:</label>
                {this.loadAllExtraAttributes()}
                <button className="btn btn-primary" type="button" onClick={() => this.props.addExtraAttribute()}>
                    Extra attribute
                </button>
            </div>
        );
    }
}

const AddExtraAtrributes = compose(
    withRouter,
    withFirebase,
)(AddExtraAtrributesBase);

export default AddExtraAtrributes;