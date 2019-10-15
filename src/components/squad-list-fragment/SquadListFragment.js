import React from 'react';
import SquadListItem from '../squad-list-item/SquadListItem';

export default class SquadListFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            squads: [],
            game_id: 0,
            player_id: 0,
            joinedSquadId: 0
        }
    }

    componentDidMount() {
        this.setState({
            game_id: this.props.game_id,
            player_id: this.props.player_id
        }, () => {
            this.getSquads(this);
        })
    }

    async getSquads(that) {
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/1/squad`

        await fetch(targetUrl).then(resp => resp.json())
        .then(resp => {
            that.setState({
                squads: [...resp]
            });
        }).catch(e => {
            console.log(e);
        })

        console.log("squadlist game_id: " + that.state.game_id);
        
    }

    /*================
    Need Id's!
    ================ */
    handleJoinSquad(squad_id) {
        console.log("handleJoinSquad from child " + squad_id);

        const game_id = this.props.game_id;
        const player_id = this.props.player_id;

        const newSquadMember = {
            "game_Id": game_id,
            "squad_Id": squad_id,
            "player_Id": player_id
        }

        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/1/squad/1/member`

        fetch(targetUrl, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newSquadMember)
        }).then(resp => resp.json()
        ).then(data => {
            console.log('Squadmember joined: ', data);

        }).catch(e => {
            console.log(e);
        }) 

        this.setState({
            joinedSquadId: squad_id
        })

        this.props.onJoinSquad(squad_id);
    }

    render() {
        let squadComponents = null;

        if (this.state.squads.length > 0) {
            squadComponents = this.state.squads.map((squad, index) => {
                return <SquadListItem squad={squad} key={squad.squad_Id} onJoinSquad={this.handleJoinSquad.bind(this)}/>
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