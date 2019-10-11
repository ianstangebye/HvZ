import React from 'react';
import styles from './BiteCodeFragment.module.css';

export default class BiteCodeFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            player: [],
            showResults: false,
            copied: ''
        }

        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        this.setState({showResults: true});
    }

    // Copy bitecode from input field
    handleCopyClick = (e) => {
        this.inputField.select();
        this.inputField.setSelectionRange(0, 100); //for mobile
        document.execCommand('copy');
        e.target.focus();
        this.setState({copied: 'Copied!'});
    }

    // Get bitecode from player
    // Missing: Get game_id and player_id
    componentDidMount() {
        
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/1/player/3`

        fetch(targetUrl).then(resp => resp.json()).then(data => {
            this.setState({
                player: {...data}
            });
        }).catch(e => {
            console.log(e);
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className={styles.BiteCodeFragment}>
                    <button className={styles.BtnGetCode} onClick={this.handleClick} style={{display: !this.state.showResults ? 'block' : 'none'}}>Get bite code</button>
                    <input readOnly ref={(input) => this.inputField = input} value={this.state.showResults ? this.state.player.bite_Code : ' '}/>
                    <button className={styles.BtnCopyCode} style={{display: this.state.showResults ? 'block' : 'none'}} onClick={this.handleCopyClick}>Copy</button>
                    {/* {this.state.copied} */}
                </div>
            </React.Fragment>
        )
    }
}