import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-firebase'
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {initializeApp} from "firebase";

var config = {
    apiKey: "AIzaSyD-nmvs60GTV51xt3aEiOXpqL8SxONhw_8",
    authDomain: "parking-booking-system-16683.firebaseapp.com",
    databaseURL: "https://parking-booking-system-16683.firebaseio.com",
    projectId: "parking-booking-system-16683",
    storageBucket: "",
    messagingSenderId: "1045815455185"
};
var firebaseApp = initializeApp(config);


ReactDOM.render(
    <Provider firebaseApp={firebaseApp}>
        <App/>
    </Provider>
    , root);
registerServiceWorker(); 