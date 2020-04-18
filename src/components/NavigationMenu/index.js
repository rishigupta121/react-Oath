import React from 'react';
import $ from 'jquery';
import './ActiveMenuItem';
import DATABASE from "../Database";
import {compose} from 'recompose';
import {withRouter} from 'react-router-dom';
import {filterCategoriesOnTime} from '../HelperFunctions/FilterCategories';
import {withFirebase} from '../Firebase';
import { Link } from "react-scroll";

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categoryNames:'',
        };
    }

    sortCategories(categories){
        return categories.sort(function(a,b) {return (a.orderingNumber > b.orderingNumber) ? 1 : ((b.orderingNumber > a.orderingNumber) ? -1 : 0);} );
    }

    componentDidMount() {
        // TODO markActiveMenuItem();
        var url = new URL(window.location.href);
        var restaurantId = url.searchParams.get("restaurantId");
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId + '/categories').once('value').then(snapshot => {
            let categories = snapshot.val();
            categories = filterCategoriesOnTime(categories);
            categories = this.sortCategories(categories);
            let categoryNames = [];
            for (const key in categories) {
                if (!categories.hasOwnProperty(key)) {
                    break;
                }
                categoryNames.push(categories[key].name);
            }
            this.setState({
                categoryNames: categoryNames,
            });
        });

        $('a[href^="#"]').click(function () {
            $('html, body').animate({
                scrollTop: $('[name="' + $.attr(this, 'href').substr(1) + '"]').offset().top
            }, 500);

            return false;
        });

    }

    render() {
        return (
            <div id="top-menu">
                <div className="row top-menu"> {this.buildTopMenu(this.state.categoryNames)} </div>
            </div>
        );
    }

    buildTopMenu(categoryNames) {
        var topMenu = [];
        for (var i = 0, max = categoryNames.length; i < max; i++) {
            var anchor = categoryNames[i];
            if (i === 0) {
                topMenu.push(<div key={i} className="top-category"><Link className="top-category-anchor active-menu" href={"#" + anchor} smooth={true}
                                                                         to={anchor}>{categoryNames[i]} </Link></div>);
            } else {
                topMenu.push(<div key={i} className="top-category"><Link className="top-category-anchor" href={"#" + anchor} smooth={true}
                                                                         to={anchor}>{categoryNames[i]}</Link></div>);
            }
        }
        return topMenu;
    }
}
const NavigationMenu = compose(
    withRouter,
    withFirebase,
)(Navigation);

export default NavigationMenu;
