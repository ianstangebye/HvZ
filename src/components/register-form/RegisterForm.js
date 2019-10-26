import React from 'react';
import styles from './RegisterForm.module.css';
import { Redirect } from 'react-router';
import Header from '../header/Header';

export default class RegisterForm extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            signin: false,
            user_id: 0
        }

        
    }

    handleSignInClick = event => {
        //Show to login-form
        this.setState({signin: true})
    }

    updateInputValue = (name, e) => {
        this.setState({ [name]: e.target.value});
    }

    handleRegisterClick = event => {
        if(this.state.firstName === '' || this.state.lastName === '' || 
            this.state.username === '' || this.state.password === '') {
            alert("Please fill all input fields!");
        }

        const newUser={
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "username": this.state.username,
            "password": this.state.password,
            "is_admin": false
        }

        const targetUrl = 'https://hvz-webapi.azurewebsites.net/game/auth'
        
        const that = this;

        fetch(targetUrl, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(newUser)
        }).then(function(resp) {
            return resp.json();
        }).then(function(data) {
            console.log('Created Account:', data);
            if(data === -1) {
                console.log("There is already same username");
            } else {
                that.setState({
                    user_id: data
                }, () => {
                    alert("Registration Successful");
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        if(this.state.signin) {
            return <Redirect push to="/login" />;
        } 

        if(this.state.user_id !== 0) {
            return <Redirect push to="/login" />;
        }

        return (
            <React.Fragment>
                <Header userInfo={this.state.userInfo} loggedIn={false}></Header>
                <div className={styles.RegisterForm}>
                    <form>
                    <div className="FirstName">
                            <label>First Name</label>
                            <input autoFocus required type="text" name="firstname" placeholder="Your first name" maxLength="50" value={this.state.firstName} onChange={(e) => this.updateInputValue("firstName", e)}/>
                        </div>
                        <div className="LastName">
                            <label>Last Name</label>
                            <input required type="text" name="lastname" placeholder="Your last name" maxLength="50" value={this.state.lastName} onChange={(e) => this.updateInputValue("lastName", e)}/>
                        </div>
                        <div className="Username">
                            <label>Username</label>
                            <input required type="text" name="username" placeholder="Create a username" maxLength="25" value={this.state.username} onChange={(e) => this.updateInputValue("username", e)}/>
                        </div>
                        <div className="Password">
                            <label>Password</label>
                            <input required type="password" name="password" placeholder="Password" value={this.state.password} onChange={(e) => this.updateInputValue("password", e)}/>
                        </div>
                    </form>
                    <div className={styles.Btns}>
                        <button className={styles.BtnRegister} onClick={this.handleRegisterClick}>Register</button>
                        <button className={styles.BtnSignIn} onClick={this.handleSignInClick}>Sign in</button>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}