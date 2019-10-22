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
            game_id: game_id,
            userInfo: state.userInfo
        }, this.getPlayer)


        // setInterval(this.GoogleMapElement.current.getLocation(), 10000);
        // this.GoogleMapElement.current.setInt();
        // this.GoogleMapElement.current.setInterval(() => {
        //     this.GoogleMapElement.current.getLoction()
        // }, 10000);
        // if(navigator.geolocation){
        //     navigator.geolocation.watchPosition(showPosition);
        // } else {
        //     alert('Your browser does not support location tracking');
        // }

        // if(navigator.geolocation){
        //     navigator.geolocation.watchPosition(this.updatePosition);
        // } else {
        //     alert('your browser does not support location tracking');
        // }    

        
        
    }

    // showPosition(position){
    //     this.GoogleMapElement.current.showPosition(position);
    // }

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
        const uid = this.state.userInfo.user_id
        const url = `http://case-hvzapi.northeurope.azurecontainer.io/game/${gid}/user/${uid}/player`

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
        
        const url = `http://case-hvzapi.northeurope.azurecontainer.io/game/${gid}/member/${pid}`

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
                
                
                //if(!this.stop)
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

    updateGameState = (game_state) => {
        this.setState({
            game_state: game_state
        })
    }

    updateSquadDetails = () =>{
        console.log('Hello, you are attempting to create a new squad checkin');
        this.GoogleMapElement.current.renderCheckIns();
        
    }

    // updatePosition = () =>{
    //     console.log(position);
    //     if(this.GoogleMapElement.current === null){
    //         console.log("undefined");
            
    //     } else {
    //          this.GoogleMapElement.current.showLocation(position);
    //     }
        
    // }

    render() {
        if (!this.state.ready) return <h1>Loading Game Detail...</h1>

        const user_id = this.state.userInfo.user_id
        const player = this.state.player
        const player_id = player.player_Id
        const squad_id = this.state.squad_id
        const game_id = this.state.game_id
        const squad_member_id = this.state.squad_member_id

        const unregistered = player_id ? false : true
        //const admin = sessionStorage.role === "Admin"
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


        let squadFragment = [<SquadListFragment onUpdate={this.getPlayer} game_id={game_id} player_id={player_id} squad_id={squad_id} is_human={player.is_Human} userInfo={userInfo} />]
        if(squad_id) squadFragment.unshift(<SquadDetailsFragment onUpdate={this.getPlayer} game_id={game_id} player_id={player_id} squad_id={squad_id} squad_member_id={squad_member_id} userInfo={userInfo} />)

        if(admin) {
            return (
                <Fragment>
                    <img src={pictureId} className={styles.AdminPic} alt="Player"></img>
                    <div className={styles.Admin}>
                        <div className={styles.ColLeft}>
                            <TitleFragment onUpdate={this.updateGameState} game_id={game_id} userInfo={userInfo} player={player} />
                            <SquadListFragment game_id={game_id} player_id={player_id} adminMode={true} userInfo={userInfo}/>
                            
                        </div>
                        <div className={styles.ColRight}>
                            <GoogleMap game_id={game_id} player={player} userInfo={userInfo} />
                            <ChatFragment adminMode={true} game_id={game_id} player_id={player_id} userInfo={userInfo} />
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
                        <TitleFragment onUpdate={this.updateGameState} game_id={game_id}  userInfo={userInfo} player={player}/>
                        <GoogleMap game_id={game_id} player={player}  userInfo={userInfo} squad_id={squad_id} />
                        <SquadListFragment game_id={game_id} player_id={player_id} squad_id={squad_id} userInfo={userInfo} />
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
                    <GoogleMap ref={this.GoogleMapElement} game_id={game_id} player={player} userInfo={userInfo} />
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
                        <GoogleMap ref={this.GoogleMapElement} game_id={game_id} player={player} userInfo={userInfo} />
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