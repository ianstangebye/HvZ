import React from 'react';
import styles from './Header.module.css';
import logo from '../../assets/placeholder_logo.png'
import { Link } from 'react-router-dom';

export default class Header extends React.Component {
    constructor(props) {
        super(props) 

        this.state = {
            userInfo: this.props.userInfo,
            loggedIn: this.props.userInfo
        }
    }

    render() {
        return(
            <React.Fragment>
                <Link to={{
                    pathname: '/',
                    state: { 
                        userInfo: this.state.userInfo,
                        loggedIn: this.state.loggedIn
                    }
                    }}
                >
                <img src={logo} alt={logo} className={styles.Header}></img>
                </Link>
            </React.Fragment>
        )
    }
}