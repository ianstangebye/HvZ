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

class GameDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            game_id: 0,
            squad_id: 0,
            player: {},
            user_id: 0
        }

        this.component1 = React.createRef()
    }

    componentDidMount() {
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

    getPlayer = () => {
        console.log("------------ FETCHING PLAYER ------------")

        const gid = this.state.game_id
        const uid = this.state.user_id
        const url = `http://case-hvzapi.northeurope.azurecontainer.io/game/${gid}/user/${uid}/player`

        // Get this user's player object, if it exists
        axios
            .get(url)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        player: res.data
                    })
                } else if (res.status === 204) {
                    this.setState({
                        player: {}
                    })
                } else {
                    throw new Error(`STATUS CODE: ${res.status}`)
                }
            })
            .catch(e => {
                console.error(e)
            })

        console.log("GAME ID: " + gid)
        console.log("USER ID: " + uid)
    }

    render() {
        const user_id = this.state.user_id
        const player = this.state.player
        const player_id = player.player_Id
        const game_id = this.state.game_id
        const hasJoined = player_id ? true : false

        if (game_id === 0) {
            return (<h1>Loading Game Detail...</h1>)
        }
        else if(!hasJoined) {
            return (
                <Fragment>
                    <RegistrationFragment onUpdate={this.getPlayer} player_id={player_id} user_id={user_id} game_id={game_id} />
                    <TitleFragment game_id={game_id} />
                    <GoogleMap game_id={game_id} player={player} />
                    <SquadListFragment game_id={game_id} player_id={player_id} />
                </Fragment>
            )
        }

        return (
            <React.Fragment>
                {/* WE NEED SOME MORE LOGIC TO DECIDE WHICH COMPONENTS TO SHOW BASED ON THE USER'S ROLE, WHETHER THEY'RE A PLAYER OR NOT, AND IF THEY ARE; THEIR PLAYER INFO */}

                <BiteCodeFragment game_id={game_id} player={player} />
                <BiteCodeEntry game_id={game_id} player={player} />
                <RegistrationFragment onUpdate={this.getPlayer} player_id={player_id} user_id={user_id} game_id={game_id} />
                <TitleFragment game_id={game_id} />
                <SquadListFragment game_id={game_id} player_id={player_id} />
                <ChatFragment game_id={game_id} player_id={player_id} />
                <GoogleMap game_id={game_id} player={player} />
                <MissionList game_id={game_id} />

            </React.Fragment>
        )
    }
}

export default GameDetail