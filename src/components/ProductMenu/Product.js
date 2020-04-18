import React from "react";
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import {compose} from "recompose";
import {withRouter} from 'react-router-dom';

class ProductBase extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.shopProductCount !== null) {
            this.state = {
                count: this.props.shopProductCount,
            };
        } else {
            this.state = {
                count: 0,
            };
        }
    }

    openProduct() {
        if (this.props.clickable) {
            //TODO fix this now
            // loadProductPage(this.props.product, this.props.shopProduct);
        }
    }

    getProductTitle() {
        if (this.state.count === 0) {
            return (
                <h6 className="product-card-title font-weight-bold width-100 mt-3">{this.props.product.name}</h6>
            )
        } else {
            return (
                <h6 className="product-card-title font-weight-bold width-100 mt-3"><label
                    className="light-gray"> {this.state.count}x</label> {this.props.product.name}</h6>
            )
        }
    }

    render() {

        let productCardDivClassName;

        if (this.state.count === 0) {
            productCardDivClassName = "product-card pl-2 pr-2";
        } else {
            productCardDivClassName = "product-card pl-2 pr-2 background-strip";
        }
        var productCardClassName;
        if (this.props.product.imageUrl) {
            productCardClassName = "product-card-content col-8";
        } else {
            productCardClassName = "product-card-content col-11";
        }
        return (
            <Link to={{
                pathname: ROUTES.PRODUCT_PAGE,
                state: {
                    product: this.props.product
                },
                search: this.props.location.search,
            }}>
                <div className={productCardDivClassName} id={this.props.product.id}>
                    <div className={productCardClassName}>
                        {this.getProductTitle()}
                        <p className="card-description width-100 mt-1">{this.props.product.description}</p>
                        <p className="card-price width-100 mt-1 mb-3">€{parseFloat(this.props.product.price).toFixed(2)}</p>
                    </div>
                    {this.props.product.imageUrlThumbnail ?
                        <div className="product-card-image col-3">
                            <img alt="product" className="product-image-small mx-auto d-block"
                                 src={this.props.product.imageUrlThumbnail}/>
                        </div> : ""
                    }
                </div>
            </Link>
        );
    }
}

const Product = compose(
    withRouter,
)(ProductBase);

export default Product;

