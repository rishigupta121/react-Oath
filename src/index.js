import React from 'react';
import ReactDOM from 'react-dom';
import './css/orderme-style.css';
import 'croppie/croppie.css'
import * as serviceWorker from './serviceWorker';
import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase';
import {BrowserRouter as Router} from "react-router-dom";

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <Router>
            <App />
        </Router>
    </FirebaseContext.Provider>,
    document.getElementById('root'),
);
serviceWorker.unregister();