import React from 'react';
import styles from './SquadListItem.module.css';

export default class SquadListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squadMembers: [],
            deceasedMembers: 0
        }
    }

    // Need game_Id??
    async componentDidMount() {
        
        const targetUrl =  `http://case-hvzapi.northeurope.azurecontainer.io/game/1/squad/${this.props.squad.squad_Id}/member`

        await fetch(targetUrl).then(resp => resp.json()).then(resp => {
            this.setState({squadMembers: [...resp]})
            for (let i = 0; i < this.state.squadMembers.length; i++) {
                if (this.state.squadMembers[i].is_Human === false) {
                    this.setState({deceasedMembers: this.state.deceasedMembers +1})
                }
            }
        }).catch(e => {
            console.log(e); 
        })                    
    }

    joinSquad() {
        const squadId = this.props.squad.squad_Id;
        this.props.onJoinSquad(squadId);
    }

    render() {
        return(
            <div className={styles.SquadListItem}>
                <h4>{this.props.squad.name}</h4>
                <p className={styles.Total}>Members: {this.state.squadMembers.length} </p>
                <p className={styles.Deceased}>Deceased members: {this.state.deceasedMembers}</p>
                <button onClick={this.joinSquad.bind(this)}>Join</button>
            </div>
        )
    }
}
