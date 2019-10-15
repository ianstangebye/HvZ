import React from 'react';
import SquadListItem from '../squad-list-item/SquadListItem';
import styles from './SquadListFragment.module.css';
import arrowUpIcon from '../../assets/arrow-up-icon.svg';
import arrowDownIcon from '../../assets/arrow-down-icon.svg';


export default class SquadListFragment extends React.Component {

    state = {
        squads: [],
        game_Id: '',
        player_Id: '',
        isVisible: false
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
    handleJoinSquad(name) {
        console.log("handleJoinSquad from child " + name);
        
        // const squad_id = this.state.squads.squad_Id;
        // const game_id = this.props.game_id;
        // const player_id = this.props.player_id;

        // const newSquadMember = {
        //     "game_Id": game_id,
        //     "squad_Id": squad_id,
        //     "player_Id": player_id
        // }

        // const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/1/squad/1/member`

        // fetch(targetUrl, {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify(newSquadMember)
        // }).then(resp => resp.json()
        // ).then(data => console.log('Squadmember joined: ', data)
        // ).catch(e => {
        //     console.log(e);
        // })
    }

    handleClick = () => {
        this.setState({
            isVisible: !this.state.isVisible
        });

        //Replace text with icons
        if (this.state.isVisible == false) {
            document.getElementById("SquadCollapseBtn").innerHTML = `<img src=${arrowDownIcon} />`;
        } else {
            document.getElementById("SquadCollapseBtn").innerHTML = `<img src=${arrowUpIcon} />`;
        }
    }

    render() {
        let squadComponents = null;

        if (this.state.squads.length > 0) {
            squadComponents = this.state.squads.map((squad, index) => {
                return <SquadListItem squad={squad} key={index} joinSquad={this.handleJoinSquad.bind(null, index)}/>
            });
        } else {
            squadComponents = <p>Loading squads...</p>
        }

        return (
            <React.Fragment>
                <div className={styles.Title}>
                    <h1>Squads</h1>
                    <button className={styles.CollapseBtn} id="SquadCollapseBtn" type="button" onClick={this.handleClick}><img src={arrowUpIcon}/></button>
                </div>
                
                <div style={{display: this.state.isVisible ? 'none' : 'block'}}>
                    {squadComponents}
                </div>
            </React.Fragment>
        )
    }
}