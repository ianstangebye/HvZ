import React from 'react';
import styles from './TitleFragment.module.css';

export default class TitleFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            game: {},
            game_id: 0
        }
    }

    componentDidMount() {
        const game_id  = this.props.game_id;
        this.setState({ game_id : game_id }, () => {
            //console.log("title game_id: " + this.state.game_id);

            this.getGameTitle();
        });
    }

    getGameTitle = async () => { 
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.props.game_id}`
        console.log("targetUrl : " + targetUrl);
        
        await fetch(targetUrl).then(resp => resp.json()).then(resp => {
            console.log(resp);
            this.setState({ game: resp });
        }).catch(error => {
            console.log('Something fucked up')
            console.log(error);

        });
    }
    
    render() {
        console.log(this.state.game_id);
        
        // if(this.state.game_id === 0) {
        //     return <h1>Loading...</h1>
        // }
        
        return (
            <div className={styles.TitleFragment}>
                <h1>{this.state.game.name}</h1>
                <p>Game State: <b>{this.state.game.game_State}</b></p>
                <p>{this.state.game.description}</p>
                <div className={styles.Rules}>
                    <h2>Rules:</h2>
                    <p>
                    (Placeholder rules) HVZ is played with two teams: the Humans and the Zombies. Players are able to tell the two teams apart with the use of bandanas; Humans wear their bandanas around an arm or on a leg, whereas Zombies wear it around their head.
                    <br/><br/>Humans are allowed to use weapons to tag out Zombies; common weapons include Nerf and other dart blasters. Balled up socks can be also be used to tag out Zombies. Rule variants exist where Humans are also allowed to use foam melee weapons, such as the N-Force weapons.
                    <br/><br/>Zombies are not allowed to use any form of weapon and instead must tag Humans by hand.
                    </p>
                </div>
            </div>
        )
    }

}