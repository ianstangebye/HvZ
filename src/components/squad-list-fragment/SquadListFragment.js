import React from 'react';
import SquadListItem from '../squad-list-item/SquadListItem';

export default class SquadListFragment extends React.Component {

    state = {
        squads: [],
        game_Id: '',
        player_Id: ''
    }

    componentDidMount() {
        
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/1/squad`

        fetch(targetUrl).then(resp => resp.json())
        .then(resp => {
            this.setState({
                squads: [...resp]
            });
        }).catch(e => {
            console.log(e);
        })
    }

    /*================
    Need Id's!
    ================ */
    handleJoinSquad() {
        const squadId = this.state.squad.squad_Id;

        const newSquadMember = {
            "game_Id": this.state.game_Id,
            "squad_Id": squadId,
            "player_Id": this.state.player_Id
        }

        
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/1/squad/1/member`

        fetch(targetUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newSquadMember)
        }).then(resp => resp.json()
        ).then(data => console.log('Squadmember joined: ', data)
        ).catch(e => {
            console.log(e);
        })
    }

    render() {
        let squadComponents = null;

        if (this.state.squads.length > 0) {
            squadComponents = this.state.squads.map(squad => {
                return <SquadListItem squad={squad} key={squad.squad_Id} joinSquad={ () => this.handleJoinSquad()}/>
            });
        } else {
            squadComponents = <p>Loading squads...</p>
        }

        return (
            <React.Fragment>
                <h2>Squads to join:</h2>
                <div>
                    {squadComponents}
                </div>
            </React.Fragment>
        )
    }
}