import React from 'react';
import styles from './TitleFragment.module.css';

export default class TitleFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            game: {}
        }
    }

    componentDidMount() {

        // Get id from the button/game clicked on from the list? 
        //const {game_id} = this.props.match.params;
        
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/2`

        fetch(proxyUrl + targetUrl).then(resp => resp.json()).then(data => {
            this.setState({
                game: {...data}
            });
        }).catch(e => {
            console.log(e);
        })
    }
    

    render() {
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