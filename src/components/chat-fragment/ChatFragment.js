import React from 'react';
import axios from 'axios';
import styles from './ChatFragment.module.css';

class ChatFragment extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],

            // These will change depending on the logged in user's type (human, zombie),
            // whether they have a squad or not, and if they are an admin on not
            tabs: [
                "Global",
                "Human",
                "Zombie",
                "Squad"
            ],

            activeTab: "Global"
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
        let mainUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/1/chat/${tab}`;

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

    sendMessage(e) {
        // If messagelength > 0
        //  send message
        // NB!: clear input

        console.log("Send");
        console.log(e);
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

        let messages = <p>No messages 😢</p>;       

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
                    <input id={styles.MsgInput} type="text" onKeyDown={(e) => e.key === "Enter" ? this.sendMessage() : null}></input>
                    <button id={styles.BtnSend} onClick={this.sendMessage}>Send</button>
                </footer>
            </div>
        )
    }
}

export default ChatFragment;