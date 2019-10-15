import React from 'react';
import styles from './SquadListItem.module.css';

export default class SquadListItem extends React.Component {

    state = {
        squadMembers: [],
        deceasedMembers: 0
    }

    // Need game_Id??
    componentDidMount() {
        
        const targetUrl =  `http://case-hvzapi.northeurope.azurecontainer.io/game/1/squad/${this.props.squad.squad_Id}/member`

        fetch(targetUrl).then(resp => resp.json()).then(resp => {
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

    render() {
        return(
            <div className={styles.SquadListItem}>
                <h4>{this.props.squad.name}</h4>
                <p className={styles.Total}>Total # of players: {this.state.squadMembers.length} </p>
                <p className={styles.Deceased}>Deceased players: {this.state.deceasedMembers}</p>
                <button onClick={this.props.joinSquad.bind(this.props.squad.name)}>Join {this.props.squad.name}</button>
            </div>
        )
    }
}
