import React from 'react';
import styles from './LoginForm.module.css';
import { Redirect } from 'react-router';
import jwt_decode from 'jwt-decode';

class LoginForm extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            loggedIn: false,
            register: false
        }
    }

    //Check if username and/or password-input is more than 0?
    // validateForm(){
    //     return this.state.username > 0 && this.state.password.length > 0;
    // }

    // Update input value
    updateInputValue = (name, e) => {
        this.setState({ [name]: e.target.value});
    }

    updateLoggedIn() {
        this.setState({loggedIn: true});
    }

    handleSignInClick = event => {
        event.preventDefault();
        console.log('clicked sign-in button');

        const user = {
            "username": this.state.username,
            "password": this.state.password
        }

        const targetUrl = 'http://case-hvzapi.northeurope.azurecontainer.io/game/auth/authenticate'

        // 'POST' using username and password in body (Success if 200 etc..)
        fetch(targetUrl, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(resp => {
            if(resp.status === 200) {
                return resp.json();
            } else if(resp.status === 400) {
                alert("Invalid username or password.")
            } else if(resp.status === 500) {
                alert("Our servers are down at the moment. We are sorry for the inconvenience. Please try again later.")
            } else {
                throw new Error(`STATUS CODE: ${resp.status}`)
            }
        })
        .then(resp => {
            if(resp) {
                console.log('Login succeeded')
                let decoded = jwt_decode(resp)
                sessionStorage.setItem("user_id", decoded.nameid)
                sessionStorage.setItem("role", decoded.role)
                console.log("USER ID:")
                console.log(sessionStorage.getItem("user_id"))
                this.updateLoggedIn()
            } else {
                console.log("Login failed")
            }
        })
        .catch(e => {
            console.error(e);
            alert("An unexpected error occured. Please try again later.")
        });
    }

    handleRegisterClick = event => {
        console.log('clicked register button');
        //Show Register Form here
        this.setState({register: true});
        console.log(this.state.register);
        
    }
    
    render() {

        if (this.state.register) {
            return <Redirect push to="/register" />;
        }
        
        if (this.state.loggedIn) {
            return <Redirect push to="/" />;
        }
        return (
            <div className={styles.LoginForm}>
                <form>
                    <div className="Username">
                        <label>Username</label>
                        <input autoFocus required type="text" name="username" placeholder="Your username..." maxLength="20" value={this.state.username} onChange={(e) => this.updateInputValue("username", e)}/>
                    </div>
                    <div className="Password">
                        <label>Password</label>
                        <input required type="password" name="password" placeholder="Your password..." value={this.state.password} onChange={(e) => this.updateInputValue("password", e)}/>
                    </div>
                    <div className={styles.Btns}>
                        <button className={styles.BtnSignIn} onClick={this.handleSignInClick}>Sign in</button>
                        <button className={styles.BtnRegister} onClick={this.handleRegisterClick}>Register</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default LoginForm;