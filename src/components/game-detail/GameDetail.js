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
import SquadDetailsFragment from '../squad-details-fragment/SquadDetailsFragment';
import zombieImg from '../../assets/zombie.png';
import humanImg from '../../assets/human.png';
import adminImg from '../../assets/admin.png';
import EditPlayerFragment from '../edit-player-fragment/EditPlayerFragment';
import { Redirect } from 'react-router'
// eslint-disable-next-line
import TimerFragment from '../timer-fragment/TimerFragment'
// eslint-disable-next-line
import MissionList from '../mission-list/MissionList'

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
            ready: false,
            game_state: "",
            time: "",
            userInfo: props.location.state ? props.location.state.userInfo : {}
        }
    }

    componentDidMount() {
        const { game_id } = this.props.match.params
        this.setState({
            game_id: game_id
        }, this.getPlayer)
    }

    getPlayer = () => {
        console.log(" ____________ GAME DETAIL ____________")
        console.log("| FETCHING PLAYER                     |")

        this.setState({
            ready: false
        })

        const gid = this.state.game_id
        const uid = sessionStorage.getItem("user_id")
        const url = `https://52.142.92.199/game/${gid}/user/${uid}/player`

        // Get this user's player object, if it exists
        axios
            .get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.userInfo.token
                }
            })
            .then(res => {
                if (res.status === 200) {
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
        
        const url = `https://52.142.92.199/game/${gid}/member/${pid}`

        // Get this player's squad member object, if it exists
        axios
            .get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.userInfo.token
                }
            })
            .then(res => {
                console.log("Game detail getsquad res: ");
                console.log(res);
                
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
        this.GoogleMapElement.current.renderMap();
        
    }

    updateGameState = (game_state) => {
        this.setState({
            game_state: game_state
        })
    }

    updateSquadDetails = () =>{
        console.log('Hello, you are attempting to create a new squad checkin');
        this.GoogleMapElement.current.renderMap();
        
    }

    render() {
        const loggedIn = sessionStorage.getItem("user_id")
        if(!loggedIn) {
            return <Redirect to="/" />
        }

        if (!this.state.ready) return <h1>Loading Game Detail...</h1>

        const user_id = this.state.userInfo.user_id
        const player = this.state.player
        const player_id = player.player_Id
        const squad_id = this.state.squad_id
        const game_id = this.state.game_id
        const squad_member_id = this.state.squad_member_id

        const unregistered = player_id ? false : true
        const admin = this.state.userInfo.is_admin
        const userInfo = this.state.userInfo

        let pictureId = '';

        console.log("| GAME   ID: " + game_id)
        console.log("| USER   ID: " + user_id)
        console.log("| SQUAD  ID: " + squad_id)
        console.log("| " + (admin ? "Admin" : "PLAYER ID: " + player_id))
        console.log("| user info token " + this.state.userInfo.token);
        
        console.log("|_____________________________________|")

        if (admin) {
            pictureId = adminImg;
        } else if (player.is_Human) {
            pictureId = humanImg;
        } else if (!player.is_Human) {
            pictureId = zombieImg;
        }


        let squadListIdx = 0;
        let squadFragment = [<SquadListFragment key={squadListIdx} onUpdate={this.getPlayer} game_id={game_id} player_id={player_id} squad_id={squad_id} is_human={player.is_Human} userInfo={userInfo} />]
        if(squad_id) {
            squadListIdx++;
            squadFragment.unshift(<SquadDetailsFragment newSquadCheckin={this.updateSquadDetails} key={squadListIdx} onUpdate={this.getPlayer} game_id={game_id} player_id={player_id} squad_id={squad_id} squad_member_id={squad_member_id} userInfo={userInfo} />)
        }

        if(admin) {
            return (
                <Fragment>
                    <img src={pictureId} className={styles.PictureId} alt="Player"></img>
                    <div className={styles.Admin}>
                        <div className={styles.AdColLeft}>
                            <TitleFragment onUpdate={this.updateGameState} game_id={game_id} userInfo={userInfo} player={player} />
                            <SquadListFragment game_id={game_id} player_id={player_id} adminMode={true} userInfo={userInfo}/>
                            <EditPlayerFragment game_id={game_id} userInfo={userInfo}/>
                            <ChatFragment adminMode={true} game_id={game_id} player_id={player_id} userInfo={userInfo} />
                        </div>
                        <div className={styles.AdColRight}>
                            <GoogleMap game_id={game_id} player={player} userInfo={userInfo} />
                            
                        </div>
                    </div>
                </Fragment>
            )
        }

        if(unregistered) {
            return (
                <Fragment>
                    <div className={styles.Unregistered}>
                        <div className={styles.ColLeft}>
                            <TitleFragment onUpdate={this.updateGameState} game_id={game_id}  userInfo={userInfo} player={player}/>
                        </div>
                        <div className={styles.ColRight}>
                        <RegistrationFragment onUpdate={this.getPlayer} player_id={player_id} user_id={user_id} game_id={game_id} squad_id={squad_id} squad_member_id={squad_member_id} game_state={this.state.game_state} userInfo={userInfo} />
                        <GoogleMap game_id={game_id} player={player}  userInfo={userInfo} squad_id={squad_id} />
                        <SquadListFragment game_id={game_id} player_id={player_id} squad_id={squad_id} userInfo={userInfo} />
                        </div>
                    </div>
                </Fragment>
            )
        }
        
        // Registered player
        return (
            <React.Fragment>
                <div className={styles.SScreen}>
                    <RegistrationFragment onUpdate={this.getPlayer} player_id={player_id} user_id={user_id} game_id={game_id} squad_id={squad_id} squad_member_id={squad_member_id} game_state={this.state.game_state} userInfo={userInfo}/>
                    <TitleFragment onUpdate={this.updateGameState} game_id={game_id} userInfo={userInfo} player={player}/>
                    <GoogleMap ref={this.GoogleMapElement} game_id={game_id} player={player} userInfo={userInfo} squad_id={squad_id}/>
                    {player.is_Human && !player.is_Patient_Zero ? 
                        <BiteCodeFragment game_id={game_id} player={player} userInfo={userInfo}/>
                        :
                        <BiteCodeEntry newBiteCode={this.updateMap} game_id={game_id} player={player} userInfo={userInfo}/>
                    }
                    <ChatFragment player={player} squad_id={squad_id} game_id={game_id} userInfo={userInfo} />
                    {squadFragment}

                </div>

                <div className={styles.JoinedGame}>
                    <div className={styles.ColLeft}>
                        <TitleFragment onUpdate={this.updateGameState} game_id={game_id} userInfo={userInfo} player={player}/>
                        {squadFragment}
                    </div>
                    <div className={styles.ColRight}>
                        <RegistrationFragment onUpdate={this.getPlayer} player_id={player_id} user_id={user_id} game_id={game_id} squad_id={squad_id} squad_member_id={squad_member_id} game_state={this.state.game_state} userInfo={userInfo}/>
                        <GoogleMap ref={this.GoogleMapElement} game_id={game_id} player={player} userInfo={userInfo} squad_id={squad_id} />
                        {player.is_Human && !player.is_Patient_Zero ? 
                            <BiteCodeFragment game_id={game_id} player={player} userInfo={userInfo}/>
                            :
                            <BiteCodeEntry newBiteCode={this.updateMap} game_id={game_id} player={player} userInfo={userInfo}/>
                        }
                        <ChatFragment player={player} squad_id={squad_id} game_id={game_id} userInfo={userInfo} />
                    </div>
                
                {/* <MissionList game_id={game_id} /> */}
                {/* <TimerFragment game_id={game_id} /> */}
                
                
                </div>
                <img src={pictureId} className={styles.PictureId} alt="Player"></img>
                
            </React.Fragment>
        )
    }
}

export default GameDetail