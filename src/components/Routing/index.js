import React from "react";
import {compose} from 'recompose';
import {Link, withRouter} from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

class RoutingBase extends React.Component {
    render() {
        return (
            <div>
                <ul>
                    <li>
                        <Link to={{pathname :ROUTES.LOG_IN,
                            search: this.props.location.search,
                        }}>LOG_IN</Link>
                    </li>
                    <li>
                        <Link to={{pathname :ROUTES.LANDING,
                            search: this.props.location.search,
                        }}>LANDING</Link>
                    </li>
                    <li>
                        <Link to={{pathname :ROUTES.PRODUCT_PAGE,
                            search: this.props.location.search,
                        }}>PRODUCT_PAGE</Link>
                    </li>
                    <li>
                        <Link to={{pathname :ROUTES.CHECKOUT,
                            search: this.props.location.search,
                        }}>CHECKOUT</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

const Routing = compose(
    withRouter,
)(RoutingBase);

export default Routing;