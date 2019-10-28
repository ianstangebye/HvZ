import React from 'react';
import styles from './BiteCodeEntry.module.css';
import backEndUrl from '../../backEndUrl';


class BiteCodeEntry extends React.Component{
    constructor(props) {
        super(props);
        this.createBite = this.createBite.bind(this);
        this.state = {
        
            biteCode: '',
            lat: null,
            lng: null,
            description: '',
            userInfo: props.userInfo
        }

    }



        // Get id from the button/game clicked on from the list? 
        //const {game_id} = this.props.match.params;

        updateInputValue = (name, e) => {
            this.setState({ [name]: e.target.value});
            
        }

        updateDescriptionValue = (name,e) =>{
            this.setState({[name]: e.target.value});
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
    
        handleRegisterClick = async event => {
            event.preventDefault();

            // let lat = null;
            // let lng = null;




            navigator.geolocation.getCurrentPosition(
                // On success
                position =>
                // {
                //     this.state.lat = position.coords.latitude;
                //     this.state.lng = position.coords.longitude
                // }, 
                this.setState({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }, function () {
                    // console.log('the state has been changed');
                    // console.log(this.state.lat + " | " + this.state.lng);
                    this.createBite();
                }),
                // // console.log(position.coords.latitude + ' ' + position.coords.longitude),                
                // // console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`),                
                // await this.setState({lat: position.coords.latitude,lng: position.coords.longitude }),
                // // console.log(this.state),
                // On error
                err => alert(`Error (${err.code}): ${err.message}`)
             );

            
        
            // const game_id = this.props.match.params.game_id;
            // // console.log(game_id);
            // // console.log(new Date().toISOString());
            // // console.log(sessionStorage.getItem("user_id"));
            // // console.log(this.state.biteCode);
            
            // let bite={
            //     time_Of_Death: new Date().toISOString(),
            //     game_Id: game_id,
            //     lat: this.state.lat,
            //     lng: this.state.lng,
            //     killer_Id: sessionStorage.getItem("user_id"),
            //     // killer_Id: this.props.player_id,
            //     bite_Code: this.state.biteCode
            // }

            // // console.log(bite);
            


        
        
        // const targetUrl = `backEndUrl/${game_id}/kill`

        // // // console.log(JSON.stringify(bite));
        
        // fetch(targetUrl, {
        //     method: 'POST',
        //     headers: {'Content-Type':'application/json'},
        //     body: JSON.stringify(bite)
        // }).catch(error => {
        //     // console.log(error);
        // })
    }


    createBite = async () => {
            // const game_id = this.props.match.params.game_id;
            const game_id = this.props.game_id;
            // console.log(game_id);
            // console.log(new Date().toISOString());
            // console.log(sessionStorage.getItem("user_id"));
            // console.log(this.state.biteCode);

        let bite={
                time_Of_Death: new Date().toISOString(),
                game_Id: game_id,
                lat: this.state.lat,
                lng: this.state.lng,
                killer_Id: sessionStorage.getItem("user_id"),
                // killer_Id: this.props.player_id,
                bite_Code: this.state.biteCode,
                story: this.state.description
            }

            // console.log(bite);
            


        
            
        //const targetUrl = `backEndUrl/${game_id}/kill`
        const targetUrl = `${backEndUrl}${game_id}/kill`

        // // console.log(JSON.stringify(bite));
        
        await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            },
            body: JSON.stringify(bite)
        }).then(resp =>{
            // console.log(resp);
            // console.log('you are indeed getting a response');
            
        }).catch(error => {
            // console.log('you are indeed getting an error');
            
            // console.log(error);
        })

        // this.props.renderMap();
        this.props.newBiteCode();


        this.setState({
            isVisible: false
        });
        document.getElementById("showFormBtn").style.display = 'block';
    }

    render(){ 
        // // console.log(this.state);
        
        return(

            <React.Fragment>
                <div className={styles.BiteCodeEntryDiv}>
                <button id="showFormBtn" className={styles.ShowFormBtn} onClick={this.handleBtnClick}>Register Bite</button>

                <form onSubmit={this.handleRegisterClick} className={styles.BiteCodeEntry} style={{display: this.state.isVisible ? 'block' : 'none'}}>

                    <h1>Enter Bite Code</h1>

                    <input required name="biteCode" type="text" placeholder="Enter bite code here..." value={this.state.biteCode} onChange={(e) => this.updateInputValue("biteCode", e)}/>
                    
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" type="text" placeholder="(Optional) Add a description..." value={this.state.description} onChange={(e) => this.updateDescriptionValue("description", e)}/>
                    
                    <button type="submit" className={styles.SubmitBiteBtn}>Register bite</button>
                    {/* <input type="submit" className={styles.SubmitBiteBtn}/> */}
                </form>

                <button onClick={this.handleCloseClick} className={styles.CloseBtn} style={{display: this.state.isVisible ? 'block' : 'none'}}>Close</button>
                </div>
                
            </React.Fragment>
            
        )
    }
}

export default BiteCodeEntry;