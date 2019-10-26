import React from 'react';
import axios from 'axios';
import styles from './ChatFragment.module.css';
import sendIcon from '../../assets/send-icon.svg';
import backEndUrl from '../../backEndUrl';

class ChatFragment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            tabs: [],
            activeTab: "Global",
            messageText: "",
            squad_id: props.squad_id || 0,
            squads: [],
            userInfo: props.userInfo
        }
    }

    componentDidMount() {
        let tabs = ["Global"]

        if(this.props.adminMode) {
            tabs.push("Human")
            tabs.push("Zombie")
            tabs.push("Squad")
        }

        this.setState({
            tabs: tabs
        }, () => {
            if(this.props.adminMode) {
                this.getSquads()
            } else {
                this.startAutoUpdate()
            }
        })
    }

    componentDidUpdate() {
        // No need to add/remove any tabs if admin,
        // since all tabs should be visible at all times
        if(!this.props.adminMode) this.updateTabs()
    }

    // Reevaluate which tabs this user should see
    updateTabs() {
        let tabs = this.state.tabs
        let squadIdx = tabs.indexOf("Squad")
        let humanIdx = tabs.indexOf("Human")
        let zombieIdx = tabs.indexOf("Zombie")
        let shouldUpdateState = false

        // If the player is part of a squad
        if (this.props.squad_id) {

            // Add squad tab if not present
            if (squadIdx === -1) {
                tabs.push("Squad")
                shouldUpdateState = true
            }

        // If the player is not part of a squad
        } else {

            // Remove squad tab if present
            if (squadIdx !== -1) {
                tabs.splice(squadIdx, 1)
                shouldUpdateState = true
            }
        }

        // If the player is human
        if (this.props.player.is_Human) {

            // Add human tab if not present
            if(humanIdx === -1) {
                tabs.push("Human")
                shouldUpdateState = true
            }

            // Remove zombie tab if present
            if(zombieIdx !== -1) {
                tabs.splice(zombieIdx, 1)
                shouldUpdateState = true
            }

        // If the player is a zombie
        } else {

            // Add zombie tab if not present
            if (zombieIdx === -1) {
                tabs.push("Zombie")
                shouldUpdateState = true
            }

            // Remove human tab if present
            if (humanIdx !== -1) {
                tabs.splice(humanIdx, 1)
                shouldUpdateState = true
            }

        }

        if(shouldUpdateState) this.setState({ tabs: tabs })
    }
    
    componentWillUnmount() {
        this.unmounted = true
        this.stopAutoUpdate();
    }
    
    startAutoUpdate() {
        this.interval = setInterval(() => {
            this.getMessages(this.state.activeTab)
        }, 300)
    }
    
    stopAutoUpdate() {
        clearInterval(this.interval)
    }

    tabClicked(tab) {
        this.cancelUpdate = true
        this.stopAutoUpdate()
        
        this.setState({
            activeTab: tab
        }, () => {
            this.cancelUpdate = false
            this.getMessages(this.state.activeTab)
            this.startAutoUpdate()
        })
    }

    getMessages = (tab) => {
        let squad = ""

        if(tab === "Squad") {
            squad = this.props.adminMode ? this.state.squad_id : this.props.squad_id
        }
        
        //let url = `https://hvz-webapi.azurewebsites.net/game/${this.props.game_id}/chat/${tab}/${squad}`;
        let url = backEndUrl + `${this.props.game_id}/chat/${tab}/${squad}`;

        // Get appropriate messages for the active tab from the backend API
        axios
        .get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        })
        .then(resp => {
            if(resp.status === 200) {
                if(!this.unmounted && !this.cancelUpdate) {
                    this.setState({
                        messages: resp.data
                    })
                }
            } else {
                throw new Error(`STATUS CODE: ${resp.status}`)
            }
        })
        .catch(err => {
            console.error(err)
        });
    }

    getSquads = () => {
        // let url = `https://hvz-webapi.azurewebsites.net/game/${this.props.game_id}/squad`;
        let url = backEndUrl + `${this.props.game_id}/squad`;

        // Get appropriate messages for the active tab from the backend API
        axios
        .get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        })
        .then(resp => {
            if (resp.status === 200) {
                if (!this.unmounted && !this.cancelUpdate) {
                    this.setState({
                        squads: resp.data
                    }, this.startAutoUpdate)
                }
            } else {
                throw new Error(`STATUS CODE: ${resp.status}`)
            }
        })
        .catch(err => {
            console.error(err)
        });
    }

    sendMessage = () => {
        let date = new Date();
        let now = `
            ${date.getFullYear()}-
            ${date.getMonth()}-
            ${date.getDate()}
            T
            ${("0" + date.getHours()).slice(-2)}:
            ${("0" + date.getMinutes()).slice(-2)}:
            ${("0" + date.getSeconds()).slice(-2)}
        `

        if(this.state.messageText.length > 0) {
            let body = {
                message: this.state.messageText,
                is_human_global: this.state.activeTab === "Global" || this.state.activeTab === "Human",
                is_zombie_global: this.state.activeTab === "Global" || this.state.activeTab === "Zombie",
                chat_time: now,
                game_id: this.props.game_id,
                player_id: this.state.userInfo.is_admin ? 0 : this.props.player.player_Id,
                squad_id: this.state.userInfo.is_admin ? 0 : this.props.squad_id,
                username: this.state.userInfo.username,
                is_admin: this.state.userInfo.is_admin
            }
            
            // axios.post(`https://hvz-webapi.azurewebsites.net/game/${this.props.game_id}/chat`, body, {
            axios.post(backEndUrl + `${this.props.game_id}/chat`, body, {
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.userInfo.token
                }
            })
            .catch(e => console.error(e));
            
            this.setState({ messageText: "" })
        }
    }

    updateMessage = (e) => {
        this.setState({ messageText: e.target.value })
    }

    render() {
        
        // Set which tabs to render
        let tabs = this.state.tabs.map((tab, idx) => {
            let isActive = tab === this.state.activeTab;
            let classes = `${styles.Tab} ${isActive ? styles.Active : ""}`;
            let innerHtml = tab
            
            // If squad tab is selected while in adminMode and if there are any squads in the game
            if(tab === "Squad" && this.props.adminMode && isActive && this.state.squads.length > 0) {
                let updateState = e => {
                    this.setState({ squad_id: e.target.value })
                }

                // Build options for drop-down list
                let squadOptions = this.state.squads.map((squad, idx) => {
                    return <option key={idx} value={squad.squad_Id}>{squad.name}</option>
                })

                // Show drop-down list of all available squads
                innerHtml = 
                <select name="squads" onChange={updateState}>
                    <option value={-1}>Select a squad</option>
                    { squadOptions }
                </select>
            }

            return (
                <div
                    key={idx}
                    className={classes}
                    onClick={() => this.tabClicked(tab)}
                >
                    {innerHtml}
                </div>
            )
        })

        let cryEmoji = <span role="img" aria-label="crying-face-emoji">😢</span>
        let messages = <p>{this.state.activeTab === "Squads" ? "No squads in this game yet" : "No messages"} {cryEmoji}</p>;

        if(this.state.messages.length > 0) {
            messages = this.state.messages.map((msg, idx) => {
                const date = new Date(msg.chat_Time);
                const time = date.toLocaleTimeString();
                if(msg.username === this.state.userInfo.username) {
                    return <div key={idx} className={styles.UserMessage}
                            style={{ backgroundColor: msg.is_admin ? '#A7C57C' : '#2C6974',
                            fontWeight: msg.is_admin ? 'bold' : 'normal' }}>
                                <p>
                                    {msg.username}: {msg.message} 
                                </p>
                                <span className={styles.TimeStamp}>({time})</span>
                            </div>
                } else {
                    return <div key={idx} className={styles.Message}
                            style={{ backgroundColor: msg.is_admin ? '#A7C57C' : '#77A4AC',
                            fontWeight: msg.is_admin ? 'bold' : 'normal' }}>
                                <p>
                                    {msg.username}: {msg.message} 
                                </p>
                                <span className={styles.TimeStamp}>({time})</span>
                            </div>
                }
            })
        }

        if (this.state.activeTab === "Squad" && this.props.adminMode && !this.state.squads.length > 0) {
            messages = <p>No squads in this game yet</p>
        }

        let footer = 
            <footer className={styles.ChatFooter}>
                <input placeholder="Write your message here..." id={styles.MsgInput} type="text" onChange={this.updateMessage}
                    onKeyDown={(e) => e.key === "Enter" ? this.sendMessage() : null}
                    value={this.state.messageText}
                />

                <button id={styles.BtnSend} onClick={this.sendMessage}><img src={sendIcon} alt="Send"/></button>
            </footer>

        if(this.props.adminMode && this.state.activeTab === "Squad") {
            footer = 
                <footer className={styles.ChatFooter}>
                    <p id={styles.NoSend}>Admins cannot send squad messages</p>
                </footer>
        }
        
        return (
            <div className={styles.ChatFragment}>
                <div className={styles.ChatFragmentDiv}>
                    <header className={styles.Tabs}>
                        { tabs }
                    </header>

                    <div className={styles.MessagesDiv}>
                        <section className={styles.Messages}>
                            { messages }
                        </section>
                    </div>
                    

                    {footer}
                </div>
                
            </div>
        )
    }
}

export default ChatFragment;