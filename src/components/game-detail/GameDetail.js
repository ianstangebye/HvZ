import React, { Fragment } from 'react'
import styles from './GameDetail.module.css'
import TitleFragment from '../title-fragment/TitleFragment'
import SquadListFragment from '../squad-list-fragment/SquadListFragment'
import ChatFragment from '../chat-fragment/ChatFragment'
import axios from 'axios'
import RegistrationFragment from '../registration-fragment/RegistrationFragment'
import BiteCodeFragment from '../bite-code-fragment/BiteCodeFragment'
import BiteCodeEntry from '../bite-code-entry/BiteCodeEntry'
import GoogleMap from '../google-map/GoogleMap'
import MissionList from '../mission-list/MissionList'
import SquadDetailsFragment from '../squad-details-fragment/SquadDetailsFragment';

class GameDetail extends React.Component {

    constructor(props) {
        super(props);
        this.GoogleMapElement = React.createRef();
        
        this.state = {
            game_id: 0,
            squad_id: 0,
            squad_member_id: 0,
            player: {},
            user_id: 0,
            ready: false
        }
    }

    componentDidMount() {
        //Update the component in every minute
        //this.interval = setInterval(() => this.setState({ time: Date.now() }), 60000);

        const { game_id } = this.props.match.params
        const state = this.props.location.state
        
        // If user isn't logged in; redirect to GameList
        if(!state) {
            this.props.history.replace({
                pathname: "/"
            })
            
            return
        }

        this.setState({ 
            user_id: state.user_id,
            game_id: game_id
        }, this.getPlayer)
    }

    // componentWillUnmount() {
    //     clearInterval(this.interval);
    // }

    getPlayer = () => {
        console.log(" ____________ GAME DETAIL ____________")
        console.log("| FETCHING PLAYER                     |")

        this.setState({
            ready: false
        })

        const gid = this.state.game_id
        const uid = this.state.user_id
        const url = `http://case-hvzapi.northeurope.azurecontainer.io/game/${gid}/user/${uid}/player`

        // Get this user's player object, if it exists
        axios
            .get(url)
            .then(res => {
                if (res.status === 200) {
                    console.log("getplayer success");
                    
                    this.setState({
                        player: res.data,
                        ready: true
                    }, () => {
                        this.getSquad();
                    })
                } else if (res.status === 204) {
                    this.setState({
                        player: {},
                        squad_id: 0,
                        squad_member_id: 0,
                        ready: true
                    })
                } else {
                    throw new Error(`STATUS CODE: ${res.status}`)
                }
            })
            .catch(e => {
                console.error(e)
            })
    }

    getSquad = () => {
        const gid = this.state.game_id;
        const pid = this.state.player.player_Id;

        console.log("playerID: " + pid);
        
        const url = `http://case-hvzapi.northeurope.azurecontainer.io/game/${gid}/member/${pid}`

        // Get this player's squad member object, if it exists
        axios
            .get(url)
            .then(res => {
                if (res.status === 200) {
                    console.log("getSquad success");
                    
                    this.setState({
                        squad_id: res.data.squad_Id,
                        squad_member_id: res.data.squad_Member_Id,
                        ready: true
                    })
                    console.log(this.state.squad_id);
                    
                } else {
                    this.setState({
                        squad_id: 0,
                        squad_member_id: 0,
                        ready: true
                    })
                }
            })
            .catch(e => {
                console.error(e)
            })
    }

    updateMap = ()=>{
        // this.GoogleMapElement.current.render();
        // this.GoogleMapElement.current.forceUpdate();
        this.GoogleMapElement.current.renderMap();
        // console.log('the map should be rerendered');
        
    }

    render() {
        if (!this.state.ready) return <h1>Loading Game Detail...</h1>

        const user_id = this.state.user_id
        const player = this.state.player
        const player_id = player.player_Id
        const squad_id = this.state.squad_id
        const game_id = this.state.game_id
        const squad_member_id = this.state.squad_member_id

        const unregistered = player_id ? false : true
        const admin = sessionStorage.role === "Admin"

        console.log("| GAME   ID: " + game_id)
        console.log("| USER   ID: " + user_id)
        console.log("| " + (admin ? "Admin" : "PLAYER ID: " + player_id))
        console.log("|_____________________________________|")


        let squadFragment = null;
        if(squad_id) {
            squadFragment = <SquadDetailsFragment onUpdate={this.getPlayer} game_id={game_id} player_id={player_id} squad_id={squad_id} squad_member_id={squad_member_id}/>
        } else {
            squadFragment = <SquadListFragment onUpdate={this.getPlayer} game_id={game_id} player_id={player_id} squad_id={squad_id} is_human={player.is_Human}/>
        }

        // let componentsToRender = []

        if(admin) {
            return (
                <Fragment>
                    <div className={styles.Admin}>
                        <TitleFragment game_id={game_id} />
                        <GoogleMap game_id={game_id} player={player} />
                        <SquadListFragment game_id={game_id} player_id={player_id} adminMode={true}/>
                        <ChatFragment adminMode={true} game_id={game_id} player_id={player_id} />
                    </div>
                </Fragment>
            )
        }

        if(unregistered) {
            return (
                <Fragment>
                    <div className={styles.Unregistered}>
                        <RegistrationFragment onUpdate={this.getPlayer} player_id={player_id} user_id={user_id} game_id={game_id} squad_id={squad_id} squad_member_id={squad_member_id}/>
                        <TitleFragment game_id={game_id} />
                        <GoogleMap game_id={game_id} player={player} />
                        <SquadListFragment game_id={game_id} player_id={player_id} squad_id={squad_id}/>
                    </div>
                </Fragment>
            )
        }
        
        return (
            <React.Fragment>
                {player.is_Human && !player.is_Patient_Zero ? 
                    <BiteCodeFragment game_id={game_id} player={player} />
                    :
                    <BiteCodeEntry newBiteCode={this.updateMap} game_id={game_id} player={player} />
                }
                <RegistrationFragment onUpdate={this.getPlayer} player_id={player_id} user_id={user_id} game_id={game_id} squad_id={squad_id} squad_member_id={squad_member_id} />
                <TitleFragment game_id={game_id} />

                {squadFragment}
                
                <ChatFragment player={player} squad_id={squad_id} game_id={game_id} />
                <GoogleMap ref={this.GoogleMapElement} game_id={game_id} player={player} />
                {/* <MissionList game_id={game_id} /> */}
                <TimerFragment game_id={game_id} />
                
                
            </React.Fragment>
        )
    }
}

export default GameDetail