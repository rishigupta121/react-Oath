import React from "react";

class ExtraProductAttributes extends React.Component {

    getPrice(attribute) {
        if (attribute.hasOwnProperty("priceDifference") && attribute['priceDifference'] !== 0) {
            if (attribute['increase']) {
                return <span
                    className="text-grey float-right mr-2 line-height-50">+ €{parseFloat(attribute.priceDifference).toFixed(2)}</span>
            } else {
                return <span
                    className="text-grey float-right mr-2 line-height-50">- €{parseFloat(attribute.priceDifference).toFixed(2)}</span>
            }
        }
    }

    getAttributes() {
        var attributes = [];
        for (var key in this.props.attributes) {
            if (!this.props.attributes.hasOwnProperty(key)) {
                break;
            }
            var attribute = this.props.attributes[key];
            var htmlAttribute = <li key={attribute.id}>
                <label className="product-page-attributes-label-wrapper">
                    <div className="border border-dark product-attribute-content mt-2 mb-2 pl-1 pr-1">
                        <input className="line-height-50 ml-1" type="checkbox" name="extraAttributes"
                               value={attribute.id}
                               onChange={this.props.handleChange}
                               id={attribute.id} checked={this.props.selectedAttributes[attribute.id]}/>
                        <span className="line-height-50 text-grey ml-2 mt-auto mb-auto">{attribute.name}</span>
                        {this.getPrice(attribute)}
                    </div>
                </label>
            </li>;
            attributes.push(htmlAttribute);
        }
        return attributes;
    }

    render() {
        return (
            <ul className="list-unstyled mb-0">
                {this.getAttributes()}
            </ul>
        );
    }
}

export default ExtraProductAttributes;