import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line
import {BrowserRouter as Router, Route} from 'react-router-dom';
import App from './App';
import './index.css';


ReactDOM.render(
    <Router>
        <App/>

    </Router>,
    document.getElementById('root'));