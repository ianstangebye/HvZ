import React from 'react';
import styles from './TitleFragment.module.css';
import TimerFragment from '../timer-fragment/TimerFragment';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FaEdit } from 'react-icons/fa';
import { FaSave } from 'react-icons/fa';

export default class TitleFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            game: {},
            game_id: props.game_id,
            isVisible: false,
            gameStateColor: '',
            userInfo: props.userInfo,
            editing: false,
            editButtonText: '',
            editButtonSymbol: '<FaSave/>',
            editButtonFunction: this.editing,
            // newName: ''
        }
    }

    componentDidMount() {
        const game_id  = this.props.game_id;
        this.setState({ game_id : game_id }, () => {
            this.getGameTitle();
        });
        
    }

    getGameTitle = async () => { 
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.props.game_id}`

        await fetch(targetUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        }).then(resp => resp.json()).then(resp => {
            this.setState({ game: resp });
            
        }).catch(error => {
            console.log('Something fucked up')
            console.log(error);
        });       
        
        if (this.state.game.game_State === 'Registration' || this.state.game.game_State === 'registration') {
            this.setState({gameStateColor: "#A7C57C"})
        } else if (this.state.game.game_State === 'In Progress' || this.state.game.game_State === 'in progress') {
            this.setState({gameStateColor: "#F5DA81"})
        } else if (this.state.game.game_State === 'Complete' || this.state.game.game_State === 'complete') {
            this.setState({gameStateColor: "#ED553B"})
        }

        console.log("title game_id: " + this.state.game_id);

        this.props.onUpdate(this.state.game.game_State);
    }

    handleClick = () => {
        this.setState({
            isVisible: !this.state.isVisible
        });

        //Replace text with icons
        if (this.state.isVisible === false) {
            document.getElementById("CollapseBtn").innerText = "X";
        } else {
            document.getElementById("CollapseBtn").innerText = "?";
        }
    }

    updateGameState = () => {
        this.props.onUpdate(this.state.game.game_State);
    }

    editing =()=>{
        var list = document.querySelector('h1');
        list.contentEditable = true;
        list.focus();
        this.setState({
            editing: true,
            // editButtonText: 'Save Changes',
            editButtonSymbol: '<FaSave/>',
            editButtonFunction: this.saving
        });
    }

    saving= async ()=>{
        console.log("you are currently attempting to save a new game name");
        console.log(this.refs.gameName.innerText);
        var button = document.querySelector('#editButton');
        button.innerHTML = this.state.editButtonText;

        var newName = {
            name: this.refs.gameName.innerText,
            game_State: this.state.game.game_State,
            nw_Lat: this.state.game.nw_Lat,
            nw_Lng: this.state.game.nw_Lng,
            se_Lat: this.state.game.se_Lat,
            se_Lng: this.state.game.se_Lng,
            description: this.state.game.description,
            start_Time: this.state.game.start_Time,
            end_Time: this.state.game.end_Time

        };

        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.props.game_id}`

        await fetch(targetUrl, {
            method: 'PUT',
            body: JSON.stringify(newName),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        }).then(resp => resp.json())
        .then(data => console.log('changed name: ', data))
        .catch(e => {
            console.log(e);
            
        })

        this.setState({
            editing: false,
            // editButtonText: 'Save Changes',
            editButtonSymbol: 'fas fa-edit',
            editButtonFunction: this.editing
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className={styles.TitleFragment + " TitleFragment"}>
                    <div className={styles.Title}>
                        <h1 suppressContentEditableWarning={true} ref="gameName">{this.state.game.name}
                        <span suppressContentEditableWarning={true} contentEditable="false" style={{visibility: this.state.userInfo.is_admin ? 'visible' : 'hidden'}}>
                        <button suppressContentEditableWarning={true} contentEditable="false" onClick={this.state.editButtonFunction} id={styles.editButton} >
                            {/* {this.state.editButtonText} */}
                            <FaEdit />
                        </button>
                        </span>
                        </h1>
                        {/* <button onClick={this.editing} id={styles.editButton} class={this.state.editButtonSymbol}>{this.state.editButtonText}</button> */}
                        <button className={styles.CollapseBtn} id="CollapseBtn" type="button" onClick={this.handleClick}>?</button>
                    </div>
                    <div className={styles.Info}>
                        <p><span>Game State: </span> <span className={styles.GameState} style={{color: this.state.gameStateColor}}>{this.state.game.game_State}</span></p>
                        
                        <TimerFragment onUpdate={this.updateGameState} game={this.state.game} game_id={this.state.game_id} userInfo={this.state.userInfo} />

                        <p><span>Description: </span><br></br>{this.state.game.description}</p>
                        <div className={styles.Rules} style={{display: this.state.isVisible ? 'block' : 'none'}}>
                            <p><span>Rules: </span></p>
                            <p><b>Overview</b> 
                                <br/>
                                Humans vs. Zombies is a game of tag. All players begin as humans, and one is randomly chosen to be the “Original Zombie.” The Original Zombie tags human players and turns them into zombies. Zombies must tag and eat a human every 48 hours or they starve to death and are out of the game.
                            </p>
                            <p><b>Objective</b>
                                <br/>
                                The Zombies win when all human players have been tagged and turned into zombies.
                                <br/><br/>
                                The Humans win by surviving long enough for all of the zombies to starve.
                            </p>
                            <p><b>Equipment</b>
                                <br/>
                                Bandana, Foam Dart Blaster, Marshmallow Launcher and/or socks.
                            </p>
                            <p><b>Safe Zones</b>
                                <br/>
                                Some areas on campus are “no play zones,” where the game is permanently suspended. Blasters must be concealed and no players may be stunned or tagged. These areas include: Bathrooms, Health Centers, Libraries, Indoor Athletic Facilities and Academic Buildings.
                                <br/><br/>
                                Other areas on campus are merely "safe zones", where gameplay continues but humans can't be tagged (unless a zombie has both of their feet outside the safe zone). These areas include: Dorm rooms and Dining Halls.
                            </p>
                            <p><b>Safety Rules</b>
                                <br/>
                                Rules created for the safety of all players are strictly enforced. Violation of safety rules will result in a ban from the game.
                                <br/><br/>
                                No realistic looking weaponry. Blasters must be brightly colored and have blaze-orange tips.
                                <br/>
                                Players may not use cars or play where there is traffic.
                                <br/>
                                Blasters may not be visible inside of academic buildings or jobs on campus.
                                <br/>
                                Socks, Darts or Marshmallows must not hurt on impact.
                            </p>
                            <p><span>Human Rules</span>
                                <br/>
                                <b>Wearing a Bandana: </b>Humans must wear a headband around an arm or leg to identify them as players of the game. (This headband will come in handy when you become a zombie!)
                                <br/><br/>
                                <b>Stunning a Zombie: </b>Humans may stun a Zombie for 15 minutes by blasting them with a blaster or throwing a sock at them.
                                <br/><br/>
                                <b>When Tagged By a Zombie: </b>When tagged by a Zombie, a Human is required to distribute their ID card. One hour after being tagged, tie your bandanna around your head – you are now a member of the Zombie team! Go tag some Humans.
                                <br/><br/>
                                <b>I.D. Number: </b>Humans must keep an index card with their unique identification number on them at all times.
                                <br/><br/>
                                <b>Staying On Campus: </b>Humans must sleep on campus. If you need to leave campus for longer than 24 hours, contact the game moderators and remove yourself from the game.
                            </p>
                            <p><span>Zombie Rules</span>
                                <br/>
                                <b>Feeding: </b>Zombies must feed every 48 hours. A zombie feeds by reporting their tag on the website.
                                <br/><br/>
                                <b>Tagging: </b>A tag is a firm touch to any part of a Human. After tagging a Human the Zombie must collect their ID card and report the tag.
                                <br/><br/>
                                <b>Getting Shot: </b>When hit with a dart, a marshmallow, or a sock, a Zombie is stunned for 15 minutes. A stunned zombie may not interact with the game in any way. This includes shielding other zombies from bullets or continuing to run toward a human. If shot while stunned, the zombie’s stun timer is reset back to 15 minutes.
                                <br/><br/>
                                <b>Wearing A Headband: </b>Zombies must wear a bandanna around their heads at all times. The Original Zombie does not need to wear a headband.
                            </p>
                            <p><b>Other Rules</b>
                                <br/>
                                Blasting Non-Players: Blasting non-players is a bannable offense.
                                <br/><br/>
                                Non-Player Interference: People who are not registered participants may not directly interact with the game. This includes bringing food to humans or spying for either team.
                                <br/><br/>
                                Safe Zones: A zombie must have both feet outside of a safe zone to tag a human. Humans can stun zombies from inside of a safe-zone.
                                <br/><br/>
                                No Shields: Zombies may not use shields to deflect foam darts, marshmallows or socks.
                                <br/><br/>
                                Athletes: Athletes are safe during official practices, but not on the way to or from practice.
                                <br/><br/>
                                Required Academic Events: Similarly, students at required academic events are safe for the duration of the event (even if this event is in a free-play zone), but they are not safe on the way to or from the event.
                            </p>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

}