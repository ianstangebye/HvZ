import React from 'react';
import SquadDetailsItem from '../squad-details-item/SquadDetailsItem';
import styles from './SquadDetailsFragment.module.css';
import arrowUpIcon from '../../assets/arrow-up-icon.svg';
import arrowDownIcon from '../../assets/arrow-down-icon.svg';

export default class SquadDetailsFragment extends React.Component {

    constructor(props) {
        super(props);
        this.createSquadCheckin = this.createSquadCheckin.bind(this);
        this.state = {
            squadMembers: [],
            squad: {},
            corLat: null,
            corLng: null,
            isVisible: false,
            userInfo: props.userInfo,
            is_Human: null
        }
    }

    //Add a check-in marker (image etc.?)
    handleCheckIn = async () => {
        // this.props.newSquadCheckin();
        // this.createSquadCheckin();
        // console.log('check in marker');

        if(!this.props.is_Human){
            console.log('not human');
            this.setState({is_Human: false});
            
        } else {
            console.log('human');
            this.setState({is_Human: true});
            
        }
        

        //Get location
        // if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition( position =>
        //         this.setState({corLat: position.coords.latitude, corLng: position.coords.longitude})//,
        //         // console.log(position.coords.latitude + ' ' + position.coords.longitude)
                
        //     );
        // } else {
        //     alert('Geolocation is not supported by this browser.');
        // }

        navigator.geolocation.getCurrentPosition(
        
        // this.createSquadCheckin();
            // On success
            position =>
            // {
            //     this.state.lat = position.coords.latitude;
            //     this.state.lng = position.coords.longitude
            // }, 
            this.setState({
                    corLat: position.coords.latitude,
                    corLng: position.coords.longitude
                }, function () {
                console.log('the squad checkin has been changed');
                // console.log(this.state.lat + " | " + this.state.lng);
                this.createSquadCheckin();
            }),
            // console.log(position.coords.latitude + ' ' + position.coords.longitude),                
            // console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`),                
            // await this.setState({lat: position.coords.latitude,lng: position.coords.longitude }),
            // console.log(this.state),
            // On error
            err => alert(`Error (${err.code}): ${err.message}`)
         );

        // console.log(this.state.corLat);

        //Get location from geolocationthingy? 
        //or have input where player can set the coordinates themselves?
        
    }

    createSquadCheckin = async() =>{
        var startTime = new Date();
        var endTime= new Date();
        await endTime.setHours( endTime.getHours() + 2);
        console.log('the time in two hours will be '+endTime);
        
       
        

        const newCheckIn = {
            "start_Time": startTime,
            "end_Time": endTime,
            "lat": this.state.corLat,
            "lng": this.state.corLng,
            "game_Id": this.props.game_id,
            "squad_Id": this.props.squad_id,
            "squad_Member_Id": this.props.squad_member_id
        }

        console.log(newCheckIn);

        const targetUrl = `https://52.142.92.199/game/${this.props.game_id}/squad/${this.props.squad_id}/check-in`
        
        await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            },
            body: JSON.stringify(newCheckIn)
        }).then(resp => resp.json())
        .then(data => console.log('Checked in: ', data))
        .catch(e => {
            console.log(e);
            
        })

        console.log(this.props.is_human);
        




        this.props.newSquadCheckin();
    }

    // Delete a squad-member
    handleLeaveSquad = () => {
        const targetUrl = `https://52.142.92.199/game/${this.props.game_id}/squad/${this.props.squad_id}/member/${this.props.squad_member_id}`
        
        fetch(targetUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        }).then(resp => {
            console.log('Deleted Squad-member: ', resp);
            if (resp.status === 200) {
                this.props.onUpdate()
            }
        })
        .catch(e => {
            console.log(e);
        })
        
    }

    
    componentDidMount() {
        //Get squadmembers
        const targetSquadUrl = `https://52.142.92.199/game/${this.props.game_id}/squad/${this.props.squad_id}/member`

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
        const targetUrl = `https://52.142.92.199/game/${this.props.game_id}/squad/${this.props.squad_id}/`
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
                // If squad member has not been deleted
                if (squadMember.rank !== 255) {
                    return <SquadDetailsItem squadMember={squadMember} key={(squadMember.squad_Member_Id)}/>
                }
                return null
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
                    <div className={styles.CheckIn}>
                        <button className={styles.CheckInBtn} onClick={this.handleCheckIn} style={{display: this.state.isVisible ? 'none' : 'block'}}>Check-in</button>
                    </div>
                    
                </div>
                
            </React.Fragment>
        )
    }
}