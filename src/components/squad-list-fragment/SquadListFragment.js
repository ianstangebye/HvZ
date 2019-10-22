import React from 'react';
import SquadListItem from '../squad-list-item/SquadListItem';
import styles from './SquadListFragment.module.css';
import arrowUpIcon from '../../assets/arrow-up-icon.svg';
import arrowDownIcon from '../../assets/arrow-down-icon.svg';
import SquadCreationFragment from '../squad-creation-fragment/SquadCreationFragment';

export default class SquadListFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            squads: [],
            game_id: props.game_id,
            player_id: props.player_id,
            joinedSquadId: props.squad_id,
            is_human: props.is_human,
            userInfo: props.userInfo,
            isVisible: true
        }
    }

    componentDidMount() {
        // this.setState({
        //     game_id: this.props.game_id,
        //     player_id: this.props.player_id
        // }, () => {
        //     this.getSquads(this);
        // })

        this.getSquads(this);
    }

    async getSquads(that) {
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.state.game_id}/squad`

        await fetch(targetUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        }).then(resp => resp.json())
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

        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/squad/${squad_id}/member`

        fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            },
            body: JSON.stringify(newSquadMember)
        }).then(resp => resp.json()
        ).then(data => {
            console.log('Squadmember joined: ', data);

        }).catch(e => {
            console.log(e);
        }) 

        this.setState({
            joinedSquadId: squad_id
        }, () => {
            this.props.onUpdate();
        })

        //this.props.onJoinSquad(squad_id);
    }

    handleClick = () => {
        this.setState({
            isVisible: !this.state.isVisible
        })
    }

    render() {
        const hasJoined = this.state.player_id
        const adminMode = this.props.adminMode
        const is_human = this.state.is_human
        let squadComponents = <p style={{ margin: '10px', textAlign: 'center' }}>No squads created yet</p>

        if (this.state.squads.length > 0) {
            squadComponents = <p style={{ margin: '10px', textAlign: 'center' }}>No {is_human ? "human" : "zombie"} squads created yet</p>
            let filteredSquads = adminMode || !hasJoined ? this.state.squads : this.state.squads.filter(squad => squad.is_Human === is_human)
            
            if(filteredSquads.length > 0) {
                squadComponents = filteredSquads.map((squad, index) =>
                    <SquadListItem key={index} squad={squad} key={squad.squad_Id} adminMode={adminMode} player_id={this.props.player_id} squad_id={this.props.squad_id} onJoinSquad={this.handleJoinSquad.bind(this)} userInfo={this.state.userInfo} />
                )
            }
        }

        let visible = this.state.isVisible
        let arrow = <img src={visible ? arrowUpIcon : arrowDownIcon} alt={visible ? "UP" : "DOWN"} />

        return (
            <React.Fragment>
                <div className={styles.SquadList}>
                    <div className={styles.Title}>
                        <h1>Squads</h1>
                        <button className={styles.CollapseBtn} id="SquadCollapseBtn" type="button" onClick={this.handleClick}>{arrow}</button>
                    </div>
                    
                    <div className={styles.SquadComponents} style={{display: this.state.isVisible ? 'block' : 'none'}}>
                        {squadComponents}
                        <div style={{display: this.props.player_id && !this.props.squad_id ? 'block' : 'none'}}>
                            <SquadCreationFragment onUpdate={this.props.onUpdate} game_id={this.state.game_id} player_id={this.state.player_id} is_human={this.state.is_human} userInfo={this.state.userInfo} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}