import React from 'react';
import styles from './RegisterForm.module.css';

export default class RegisterForm extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            password: ''
        }

        
    }

    handleSignInClick = event => {
        //Show to login-form
    }

    updateInputValue = (name, e) => {
        this.setState({ [name]: e.target.value});
        
    }

    handleRegisterClick = event => {
        const newUser={
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "username": this.state.username,
            "password": this.state.password,
            "is_admin": false
        }
        
        
        const targetUrl = 'http://case-hvzapi.northeurope.azurecontainer.io/game/auth'
        
        fetch(targetUrl, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(newUser)
        }).then(function(resp) {
            return resp.json();
        }).then(function(data) {
            console.log('Created Account:', data);
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        return (
            <div className={styles.RegisterForm}>
                <form>
                <div className="FirstName">
                        <label>First Name</label>
                        <input autoFocus type="text" name="firstname" maxLength="50" value={this.state.firstName} onChange={(e) => this.updateInputValue("firstName", e)}/>
                    </div>
                    <div className="LastName">
                        <label>Last Name</label>
                        <input type="text" name="lastname" maxLength="50" value={this.state.lastName} onChange={(e) => this.updateInputValue("lastName", e)}/>
                    </div>
                    <div className="Username">
                        <label>Username</label>
                        <input type="text" name="username" maxLength="25" value={this.state.username} onChange={(e) => this.updateInputValue("username", e)}/>
                    </div>
                    <div className="Password">
                        <label>Password</label>
                        <input type="password" name="password" value={this.state.password} onChange={(e) => this.updateInputValue("password", e)}/>
                    </div>
                    
                </form>
                <div className={styles.Btns}>
                    <button className={styles.BtnSignIn} onClick={this.handleSignInClick}>Sign in</button>
                    <button className={styles.BtnRegister} onClick={this.handleRegisterClick}>Register</button>
                </div>
            </div>
        )
    }

}