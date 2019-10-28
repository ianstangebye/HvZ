import React from 'react';
import styles from './SquadCreationFragment.module.css';
import backEndUrl from '../../backEndUrl';

export default class SquadCreationFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            is_human: props.is_human, // true or false
            game_id: props.game_id,
            squad_id: 0,
            player_id: props.player_id,
            isVisible: false,
            userInfo: props.userInfo
        }
    }

    updateInputValue = (name, e) => {
        this.setState({ [name]: e.target.value});
    }

    // Create a new squad
    onClickCreate = event => {
        // console.log(this.state.name);
        // console.log('Created');

        const newSquad = {
            "name": this.state.name,
            "is_human": this.state.is_human,
            "game_id": this.state.game_id
        }

        const targetUrl = backEndUrl + `${this.state.game_id}/squad`
        
        // console.log(targetUrl);
        // console.log(newSquad);

        const that = this;
        
        if (this.state.name.length > 0) {
            fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer ' + this.state.userInfo.token
                },
                body: JSON.stringify(newSquad)
            }).then(function(resp) {
                return resp.json();
            }).then(function(data) {
                // console.log('Created Squad:', data);
                that.setState({
                    squad_id: data
                }, () => {
                    that.onClickJoin();
                })
            }).catch(e => {
                console.error(e);
            })
        }
    }

    //Join the new squad 
    onClickJoin = event => {
        // console.log('Joined');

        const newSquadMember = {
            "game_id": this.state.game_id,
            "squad_id": this.state.squad_id,
            "player_id": this.state.player_id
        }

        const targetUrl = backEndUrl + `${this.state.game_id}/squad/${this.state.squad_id}/member`

        fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            },
            body: JSON.stringify(newSquadMember)
        })
        .then(resp => resp.json())
        // .then(data => // console.log('Squadmember joined: ', data))
        .catch(e => {
            console.error(e);
            
        })

        this.props.onUpdate();
    }

    handleShowFormClick = () => {
        this.setState({
            isVisible: !this.state.isVisible
        });
        document.getElementById("showForm").style.display = 'none';
    }

    handleCloseClick = () => {
        this.setState({
            isVisible: !this.state.isVisible
        });
        document.getElementById("showForm").style.display = 'block'
    }

    render(){
        return(
            <React.Fragment>
                <div className={styles.SquadCreationFragment}>
                    <div id="showForm" className={styles.ShowForm}>
                        <button className={styles.ShowFormBtn} type="button" onClick={this.handleShowFormClick}>+</button>
                    </div>
                    
                    <div className={styles.CreationForm} style={{display: this.state.isVisible ? 'block' : 'none'}}>
                        <h2>Create a new squad</h2>
                        <form>
                            <label>Name</label>
                            <input autoFocus type="text" placeholder="Squad name here..." value={this.state.name} onChange={(e) => this.updateInputValue("name", e)} required></input>
                            
                        </form>
                        <p className={styles.WarningMessage}>{this.state.message}</p>
                        <button className={styles.CreateBtn} onClick={() => {
                            this.onClickCreate();
                            //this.onClickJoin();
                        }}>Create & Join</button>
                        <button className={styles.CloseBtn} onClick={this.handleCloseClick}>Close</button>
                    </div>
                    
                </div>
            </React.Fragment>
        )
    }
}