import React from 'react';
import axios from 'axios';
import styles from './ChatFragment.module.css';

class ChatFragment extends React.Component {
    state = {
        messages: [
            {
                message_id: 1,
                message: "Message 1",
                is_human_global: true,
                is_zombie_global: false,
                chat_time: Date.now(),
                game_id: 1,
                player_id: 1,
                squad_id: null
            },
            {
                message_id: 1,
                message: "Message 2",
                is_human_global: false,
                is_zombie_global: true,
                chat_time: Date.now(),
                game_id: 1,
                player_id: 2,
                squad_id: null
            },
            {
                message_id: 1,
                message: "Message 3",
                is_human_global: true,
                is_zombie_global: true,
                chat_time: Date.now(),
                game_id: 1,
                player_id: 3,
                squad_id: null
            },
            {
                message_id: 1,
                message: "Message 4",
                is_human_global: true,
                is_zombie_global: false,
                chat_time: Date.now(),
                game_id: 1,
                player_id: 4,
                squad_id: 1
            }
        ],

        tabs: [

        ],

        activeTab: "global"
    }

    handleTabClick(e) {
        // Add active class to the clicked tab
        // Remove active class from other tabs
    }

    sendMessage() {
        console.log("Send");
    }

    render() {
        let messages = <p>No messages</p>;

        if(this.state.messages.length > 0) {
            messages = this.state.messages.map((msg, idx) => {
                return <p key={idx} className={styles.Message}>{msg.message}</p>
            });
        }

        return (
            <div className={styles.ChatFragment}>
                <header className={styles.Tabs}>
                    <div className={styles.Tab + " " + styles.Active}>Global</div>
                    <div className={styles.Tab}>Human</div>
                    <div className={styles.Tab}>Zombie</div>
                    <div className={styles.Tab}>Squad</div>
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