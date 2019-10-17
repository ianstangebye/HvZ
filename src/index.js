import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line
import {BrowserRouter as Router, Route} from 'react-router-dom';
import App from './App';
import './index.css';
import Moment from 'react-moment';

// Start the pooled timer which runs every 60 seconds
// (60000 milliseconds) by default.
Moment.startPooledTimer();

// Set the output timezone for local for every instance.
Moment.globalLocal = true;

ReactDOM.render(
    <Router>
        <App/>

    </Router>,
    document.getElementById('root')
);