import React from 'react';
import styles from './TitleFragment.module.css';

export default class TitleFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            game: {},
            game_id: props.game_id,
            isVisible: false,
            gameStateColor: ''
        }
    }

    componentDidMount() {
        // const game_id  = this.props.game_id;
        // this.setState({ game_id : game_id }, () => {
        //     this.getGameTitle();
        // });

        this.getGameTitle();
    }

    getGameTitle = async () => { 
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.props.game_id}`

        await fetch(targetUrl).then(resp => resp.json()).then(resp => {
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

    
    render() {
        
        // if(this.state.game_id === 0) {
        //     return <h1>Loading...</h1>
        // }
        
        return (
            <React.Fragment>
                <div className={styles.TitleFragment}>
                    <div className={styles.Title}>
                        <h1>{this.state.game.name}</h1>
                        <button className={styles.CollapseBtn} id="CollapseBtn" type="button" onClick={this.handleClick}>?</button>
                    </div>
                    <div className={styles.Info}>
                        <p><span>Game State: </span> <span className={styles.GameState} style={{color: this.state.gameStateColor}}>{this.state.game.game_State}</span></p>
                        <p><span>Description: </span><br></br>{this.state.game.description}</p>
                        <div className={styles.Rules} style={{display: this.state.isVisible ? 'block' : 'none'}}>
                            <p><span>Rules: </span><br></br> (Placeholder rules) HVZ is played with two teams: the Humans and the Zombies. Players are able to tell the two teams apart with the use of bandanas; Humans wear their bandanas around an arm or on a leg, whereas Zombies wear it around their head.
                            <br/><br/>Humans are allowed to use weapons to tag out Zombies; common weapons include Nerf and other dart blasters. Balled up socks can be also be used to tag out Zombies. Rule variants exist where Humans are also allowed to use foam melee weapons, such as the N-Force weapons.
                            <br/><br/>Zombies are not allowed to use any form of weapon and instead must tag Humans by hand.
                            </p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}