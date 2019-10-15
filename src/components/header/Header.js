import React from 'react';
import styles from './Header.module.css';
import logo from '../../assets/placeholder_logo.png'

export default class Header extends React.Component {


    render() {
        return(
            <React.Fragment>
                <img src={logo} alt={logo} className={styles.Header}></img>
            </React.Fragment>
        )
    }
}