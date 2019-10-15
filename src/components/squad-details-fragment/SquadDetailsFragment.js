import React from 'react';
import SquadDetailsItem from '../squad-details-item/SquadDetailsItem';
import styles from './SquadDetailsFragment.module.css';


export default class SquadDetailsFragment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            squadMembers: [],
            squad: {},
            corLat: null,
            corLng: null
        }
    }

    //Add a check-in marker (image etc.?)
    handleCheckIn() {
        console.log('check in marker');
        

        //Get location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position =>
                this.setState({corLat: position.coords.latitude, corLng: position.coords.longitude})
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }

        console.log(this.state.corLat);
        
        
        //Get location from geolocationthingy? 
        //or have input where player can set the coordinates themselves?
        
        
        // const newCheckIn = {
        //     "start_Time":"", //Set time manually??
        //     "end_Time": "",
        //     "lat": corLat,
        //     "lng": corLng,
        //     "game_Id": 1,
        //     "squad_Id": 1,
        //     "squad_Member_Id": 8
        // }

        // const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/1/squad/1/check-in`
        // fetch(targetUrl, {
        //     method: 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify(newCheckIn)
        // }).then(resp => resp.json())
        // .then(data => console.log('Checked in: ', data))
        // .catch(e => {
        //     console.log(e);
            
        // })
        
    }

    // Delete a squad-member
    handleLeaveSquad() {
        console.log('leaving squad');

        //const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/1/squad/1/member/12`

        fetch(targetUrl, {
            method: 'DELETE',
        }).then(resp => console.log('Deleted Squad-member: ', resp))
        .catch(e => {
            console.log(e);
        })
        
    }

    componentDidMount() {
        //Get squadmembers
        //const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        const targetSquadUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/1/squad/1/member`

        fetch(targetSquadUrl).then(resp => resp.json())
        .then(resp => {
            this.setState(
                { squadMembers: [...resp] }
            )
        }).catch(e => {
            console.log(e);
        })

        //Get squad name
        const targetUrl = 'http://case-hvzapi.northeurope.azurecontainer.io/game/1/squad/1/'
        fetch(targetUrl).then(resp => resp.json())
        .then(resp => {
            this.setState(
                { squad: {...resp} }
            )
        }).catch(e => {
            console.log(e);
        })
    }


    render() {
        let squadMemberComponents = null;

        if (this.state.squadMembers.length > 0) {
            squadMemberComponents = (this.state.squadMembers.map(squadMember => {
                if (squadMember.rank !== 255) {
                    return <SquadDetailsItem squadMember={squadMember} key={(squadMember.squad_Member_Id)}/>
                }
            }));
        } else {
            squadMemberComponents = <p>Loading squad members...</p>
        }


        return(
            <React.Fragment>
                <div className={styles.SquadDetailsFragment}>
                    <h1>{this.state.squad.name}</h1>
                    <button onClick={this.handleCheckIn}>Check-in marker</button>
                    <div>
                        {squadMemberComponents}
                    </div>
                    <button onClick={this.handleLeaveSquad}>Leave Squad</button>
                </div>
                
            </React.Fragment>
        )
    }
}