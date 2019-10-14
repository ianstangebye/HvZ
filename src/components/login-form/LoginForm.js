import React from 'react';
import styles from './LoginForm.module.css';
import { Redirect } from 'react-router';

class LoginForm extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            username: '',
            password: '',
            loggedIn: false
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

        //const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        const targetUrl = 'http://case-hvzapi.northeurope.azurecontainer.io/game/auth/authenticate'

        const that = this;
        // 'POST' using username and password in body (Success if 200 etc..)
        fetch(targetUrl, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(resp => resp.json()).then(resp => {
            if(resp != null) {                
                console.log('Login successful');
                console.log(resp);
                
                window.sessionStorage.setItem("user_id", resp.user_Id);
                window.sessionStorage.setItem("is_admin", resp.is_Admin);
                window.sessionStorage.setItem("token", resp.token);
                console.log("loginform user_id: " + window.sessionStorage.getItem("user_id") );
                that.updateLoggedIn();
            } else {
                console.log("Login faild");
                
            }
        // }).then(function(resp) {
        //     console.log(resp);
            
        //     if (resp.status === 200){
        //         console.log('Login successful');
                
        //         that.updateLoggedIn();
        //         // Show game/game list components here
        //     } else if (resp.status === 204){
        //         console.log('Username and password do not match');
        //         // alert or show an error message on page?
        //     } else {
        //         console.log("Username doesn't exist");
        //         // alert or show error message on page?
        //     }
        }).catch(function(e) {
            console.log(e);  
        });
    }

    handleRegisterClick = event => {
        console.log('clicked register button');
        //Show Register Form here
    }
    
    render() {
        if (this.state.loggedIn) {
            return <Redirect push to="/" />;
        }
        return (
            <div className={styles.LoginForm}>
                <form>
                    <div className="Username">
                        <label>Username</label>
                        <input autoFocus type="text" name="username" maxLength="20" value={this.state.username} onChange={(e) => this.updateInputValue("username", e)}/>
                    </div>
                    <div className="Password">
                        <label>Password</label>
                        <input type="password" name="password" value={this.state.password} onChange={(e) => this.updateInputValue("password", e)}/>
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