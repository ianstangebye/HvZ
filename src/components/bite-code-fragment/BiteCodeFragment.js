import React from 'react';
import styles from './BiteCodeFragment.module.css';

export default class BiteCodeFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isVisible: true,
            copyMessage: false,
            copied: ''
        }

        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        this.setState({isVisible: !this.state.isVisible});
    }

    // Copy bitecode from input field
    handleCopyClick = (e) => {
        this.inputField.select();
        this.inputField.setSelectionRange(0, 100); //for mobile
        document.execCommand('copy');
        e.target.focus();
        this.setState({copied: 'Copied!', copyMessage: true});
    }

    handleCloseClick = () => {
        this.setState({
            isVisible: !this.state.isVisible,
            copyMessage: false
        });
        document.getElementById("getCodeBtn").style.display = 'block';
    }

    render() {
        return (
            <React.Fragment>
                <div className={styles.BiteCodeFragment}>
                    <button id="getCodeBtn" className={styles.BtnGetCode} onClick={this.handleClick} style={{display: !this.state.isVisible ? 'block' : 'none'}}>Get bite code</button>
                    <div className={styles.CopyCodeForm} style={{display: this.state.isVisible ? 'block' : 'none'}}>
                        <div className={styles.CopyCode}>
                            <h2>Get bite code</h2>
                            <input readOnly ref={(input) => this.inputField = input} value={this.props.player.bite_code}/>
                            <button className={styles.BtnCopyCode}  onClick={this.handleCopyClick}>Copy</button>
                            <p style={{display: this.state.copyMessage ? 'block' : 'none'}}>{this.state.copied}</p>
                        </div>
                        <button onClick={this.handleCloseClick} className={styles.CloseBtn}>Close</button>
                        {/* {this.state.copied} */}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}