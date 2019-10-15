import React from 'react';
import styles from './BiteCodeEntry.module.css';
import { isLVal } from '@babel/types';

class BiteCodeEntry extends React.Component{
    
    state = {
        biteCode: '',
        lat: '',
        lng: '',
        isVisible: false
    }

        // Get id from the button/game clicked on from the list? 
        //const {game_id} = this.props.match.params;

        updateInputValue = (name, e) => {
            this.setState({ [name]: e.target.value});
            
        }

        handleBtnClick = () => {
            this.setState({
                isVisible: true
            });
            document.getElementById("showFormBtn").style.display = 'none';
        }

        handleCloseClick = () => {
            this.setState({
                isVisible: false
            });
            document.getElementById("showFormBtn").style.display = 'block';
        }
    
        handleRegisterClick = event => {
            event.preventDefault();

            
        
            const game_id = this.props.match.params.game_id;
            console.log(game_id);
            console.log(new Date().toISOString());
            console.log(sessionStorage.getItem("user_id"));
            let bite={
                time_Of_Death: new Date().toISOString(),
                game_Id: game_id,
                killer_Id: sessionStorage.getItem("user_id"),
                bite_Code: this.state.biteCode,
                


            }

        navigator.geolocation.getCurrentPosition(
            // On success
            position => 
            // console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`),
            this.setState({lat:position.coords.latitude,lng: position.coords.longitude }),
            console.log(this.state),
            // On error
            err => alert(`Error (${err.code}): ${err.message}`)
          );
        
        
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/kill`

        fetch(targetUrl, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(bite)
        }).then(function(resp) {
            return resp.json();
        }).then(function(data) {
            console.log('Sent in bite:', data);
        }).catch(error => {
            console.log(error);
        })

        this.setState({
            isVisible: false
        });
        document.getElementById("showFormBtn").style.display = 'block';
    }

    render(){ 
        return(

            <React.Fragment>
                <button id="showFormBtn" className={styles.ShowFormBtn} onClick={this.handleBtnClick}>Register Bite</button>

                <form onSubmit={this.handleRegisterClick} className={styles.BiteCodeEntry} style={{display: this.state.isVisible ? 'block' : 'none'}}>

                    <h1>Enter Bite Code</h1>

                    <input required name="biteCode" type="text" placeholder="Enter bite code here..." value={this.state.biteCode} onChange={(e) => this.updateInputValue("biteCode", e)}/>
                    
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" type="text" placeholder="(Optional) Add a description..."/>
                    
                    <button type="submit" className={styles.SubmitBiteBtn}>Submit</button>
                    {/* <input type="submit" className={styles.SubmitBiteBtn}/> */}
                </form>

                <button onClick={this.handleCloseClick} className={styles.CloseBtn} style={{display: this.state.isVisible ? 'block' : 'none'}}>Close</button>
            </React.Fragment>
            
        )
    }
}

export default BiteCodeEntry;