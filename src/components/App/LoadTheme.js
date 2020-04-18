import React from "react";
import {withRouter} from 'react-router-dom';
import * as ROUTES from "../../constants/routes";
import {compose} from "recompose";
import {themes} from "../ThemeContext";
import DATABASE from "../Database";
import {withFirebase} from "../Firebase";

class LoadThemeBase extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadThemeColor(this.props.restaurantId);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.restaurantId !== this.props.restaurantId){
            this.loadThemeColor(this.props.restaurantId);
        }
    }

    loadThemeColor(restaurantId) {
        if (!restaurantId || restaurantId === '') {
            return;
        }
        this.props.firebase.db.ref(DATABASE + '/restaurants/' + restaurantId).once('value').then(snapshot => {
            if (snapshot.val().color){
                document.documentElement.style.setProperty('--main-color', snapshot.val().color);
                var theme = themes.standard;
                theme.primaryColor = snapshot.val().color;
                this.props.updateTheme(theme);
            } else {
                document.documentElement.style.setProperty('--main-color', themes.standard.primaryColor);
                this.props.updateTheme(themes.standard);
            }
        }).catch(error => {
            if (error) {
                document.documentElement.style.setProperty('--main-color', themes.standard.primaryColor);
                this.props.updateTheme(themes.standard);
            }
        });
    }

    render() {
        return ('');
    }
}

const
    LoadTheme = compose(
        withRouter,
        withFirebase,
    )(LoadThemeBase);

export default LoadTheme;
