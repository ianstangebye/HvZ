import React from 'react';
import styles from './TitleFragment.module.css';
import TimerFragment from '../timer-fragment/TimerFragment';

export default class TitleFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            game: {},
            game_id: props.game_id,
            isVisible: false,
            gameStateColor: '',
            userInfo: props.userInfo,
            rules: ''
        }
    }

    componentDidMount() {
        const game_id  = this.props.game_id;
        this.setState({ game_id : game_id }, () => {
            this.getGameTitle();
        });

        console.log(this.userInfo);
        

        // if (this.userInfo.is_Human) {
        //     console.log('this is a humaaaan');
            
        // } else if (!this.userInfo.is_Human) {
        //     console.log('this is a zombie');
            
        // }

    }

    getGameTitle = async () => { 
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.props.game_id}`

        await fetch(targetUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        }).then(resp => resp.json()).then(resp => {
            this.setState({ game: resp });
            
        }).catch(error => {
            console.log('Something fucked up')
            console.log(error);
        });       
        
        if (this.state.game.game_State === 'Registration' || this.state.game.game_State === 'registration') {
            this.setState({gameStateColor: "#A7C57C"})
        } else if (this.state.game.game_State === 'In Progress' || this.state.game.game_State === 'in progress') {
            this.setState({gameStateColor: "#F5DA81"})
        } else if (this.state.game.game_State === 'Complete' || this.state.game.game_State === 'complete') {
            this.setState({gameStateColor: "#ED553B"})
        }

        console.log("title game_id: " + this.state.game_id);

        this.props.onUpdate(this.state.game.game_State);
    }

    handleClick = () => {
        this.setState({
            isVisible: !this.state.isVisible
        });

        //Replace text with icons
        if (this.state.isVisible === false) {
            document.getElementById("CollapseBtn").innerText = "X";
        } else {
            document.getElementById("CollapseBtn").innerText = "?";
        }
    }

    updateGameState = () => {
        this.props.onUpdate(this.state.game.game_State);
    }

    render() {
        
        // if(this.state.game_id === 0) {
        //     return <h1>Loading...</h1>
        // }
        
        return (
            <React.Fragment>
                <div className={styles.TitleFragment + " TitleFragment"}>
                    <div className={styles.Title}>
                        <h1>{this.state.game.name}</h1>
                        <button className={styles.CollapseBtn} id="CollapseBtn" type="button" onClick={this.handleClick}>?</button>
                    </div>
                    <div className={styles.Info}>
                        <p><span>Game State: </span> <span className={styles.GameState} style={{color: this.state.gameStateColor}}>{this.state.game.game_State}</span></p>
                        
                        <TimerFragment onUpdate={this.updateGameState} game={this.state.game} game_id={this.state.game_id} userInfo={this.state.userInfo} />

                        <p><span>Description: </span><br></br>{this.state.game.description}</p>
                        <div className={styles.Rules} style={{display: this.state.isVisible ? 'block' : 'none'}}>
                            <p><span>Rules: </span>{this.state.rules}</p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}