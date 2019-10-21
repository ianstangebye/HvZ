import React from 'react';
import SquadDetailsItem from '../squad-details-item/SquadDetailsItem';
import styles from './SquadDetailsFragment.module.css';
import arrowUpIcon from '../../assets/arrow-up-icon.svg';
import arrowDownIcon from '../../assets/arrow-down-icon.svg';

export default class SquadDetailsFragment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            squadMembers: [],
            squad: {},
            corLat: null,
            corLng: null,
            isVisible: false,
            userInfo: props.userInfo
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

        // const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.props.game_id}/squad/${this.props.squad_id}/check-in`
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
    handleLeaveSquad = () => {
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.props.game_id}/squad/${this.props.squad_id}/member/${this.props.squad_member_id}`
        
        fetch(targetUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        }).then(resp => {
            console.log('Deleted Squad-member: ', resp);
            if (resp.status == 200) {
                this.props.onUpdate()
            }
        })
        .catch(e => {
            console.log(e);
        })
        
    }

    
    componentDidMount() {
        //Get squadmembers
        const targetSquadUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.props.game_id}/squad/${this.props.squad_id}/member`

        fetch(targetSquadUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        }).then(resp => resp.json())
        .then(resp => {
            this.setState(
                { squadMembers: [...resp] }
            )
        }).catch(e => {
            console.log(e);
        })

        //Get squad name
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.props.game_id}/squad/${this.props.squad_id}/`
        fetch(targetUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        }).then(resp => resp.json())
        .then(resp => {
            this.setState(
                { squad: {...resp} }
            )
        }).catch(e => {
            console.log(e);
        })
    }

    handleCollapseClick = () => {
        this.setState({
            isVisible: !this.state.isVisible
        });

        if (this.state.isVisible === false) {
            document.getElementById("SquadMembersCollapseBtn").innerHTML = `<img src=${arrowDownIcon} alt="Down" />`;
        } else {
            document.getElementById("SquadMembersCollapseBtn").innerHTML = `<img src=${arrowUpIcon} alt="Up"/>`;
        }
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
                    <div className={styles.Title}>
                        <h1>{this.state.squad.name}</h1>
                        <button className={styles.CollapseBtn} id="SquadMembersCollapseBtn" type="button" onClick={this.handleCollapseClick}><img src={arrowUpIcon} alt="up"/></button>
                    </div>
                    <div className={styles.CheckIn}>
                        <button className={styles.CheckInBtn} onClick={this.handleCheckIn} style={{display: this.state.isVisible ? 'none' : 'block'}}>Check-in</button>
                    </div>
                    
                    <div className={styles.SquadMembers} style={{display: this.state.isVisible ? 'none' : 'block'}}>
                        <h2> {this.state.squad.name} Members</h2>
                        {/* <div className={styles.SquadMemberTitle}>
                            <p>Name</p>
                            <p>Rank</p>
                            <p>Status</p>
                        </div> */}
                        {squadMemberComponents}
                        <button className={styles.LeaveBtn} onClick={this.handleLeaveSquad}>Leave Squad</button>
                    </div>
                    
                </div>
                
            </React.Fragment>
        )
    }
}