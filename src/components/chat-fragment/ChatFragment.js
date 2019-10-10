import React from 'react';
import axios from 'axios';
import styles from './ChatFragment.module.css';

class ChatFragment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            player: {
                player_id: 1,
                is_human: true,
                is_patient_zero: false,
                bite_code: null,
                user_id: 1,
                game_id: 1
            },

            messages: [],

            // These will change depending on the logged in user's type (human, zombie),
            // whether they have a squad or not, and if they are an admin on not
            tabs: [
                "Global",
                "Human",
                "Zombie",
                "Squad"
            ],

            activeTab: "Global",

            messageText: ""
        }
    }

    componentDidMount() {
        this.getMessages(this.state.activeTab);
    }

    tabClicked(tab) {     
        this.setState({
            activeTab: tab,
            messages: []
        })

        this.getMessages(tab);
    }

    getMessages(tab) {
        let proxyUrl = "https://cors-anywhere.herokuapp.com/";
        let mainUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.state.player.game_id}/chat/${tab}`;

        // Get appropriate messages for the active tab from the backend API
        axios.get(proxyUrl + mainUrl)
        .then(resp => {
            this.setState({
                messages: [...resp.data]
            })            
        })
        .catch(err => {
            console.error(err)
        });
    }

    sendMessage = () => {
        // let proxyUrl = "https://cors-anywhere.herokuapp.com/";

        if(this.state.messageText.length > 0) {
            let body = {
                message: this.state.messageText,
                is_human_global: this.state.activeTab === "Global" || this.state.activeTab === "Human",
                is_zombie_global: this.state.activeTab === "Global" || this.state.activeTab === "Zombie",
                chat_time: Date.now(),
                game_id: this.state.player.game_id,
                player_id: this.state.player.player_id,
                squad_id: 1
            }

            console.log(body);

            axios.post("http://case-hvzapi.northeurope.azurecontainer.io/game/1/chat", body)
            .catch(e => console.error(e));
            
            console.log("Message sent");
            console.log(Date.now());
            
            this.setState({
                messageText: ""
            })
        }
    }

    updateMessage = (e) => {
        this.setState({ messageText: e.target.value })
    }

    render() {
        let tabs = this.state.tabs.map((tab, idx) => {
            let isActive = tab === this.state.activeTab;
            let classes = `${styles.Tab} ${isActive ? styles.Active : ""}`;

            return <div
                key={idx}
                className={classes}
                onClick={() => this.tabClicked(tab)}
            >{tab}</div>
        })

        let messages = <p>No messages <span role="img" aria-label="crying-face-emoji">😢</span></p>;

        if(this.state.messages.length > 0) {
            messages = this.state.messages.map((msg, idx) => {
                return <p key={idx} className={styles.Message}>{msg.message}</p>
            });
        }

        return (
            <div className={styles.ChatFragment}>
                <header className={styles.Tabs}>
                    { tabs }
                </header>

                <section className={styles.Messages}>
                    { messages }
                </section>

                <footer className={styles.ChatFooter}>
                    <input id={styles.MsgInput} type="text" onChange={this.updateMessage}
                        onKeyDown={(e) => e.key === "Enter" ? this.sendMessage() : null}
                        value={this.state.messageText}
                    />

                    <button id={styles.BtnSend} onClick={this.sendMessage}>Send</button>
                </footer>
            </div>
        )
    }
}

export default ChatFragment;