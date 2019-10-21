import React from 'react';
import MissionItem from '../mission-item/MissionItem';

class MissionList extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            missions: [],
            userInfo: props.userInfo
        }
    }

    componentDidMount(){

        const game_id = this.props.game_id;


        fetch(`http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/mission`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        }).then(resp=>resp.json())
        .then(resp=>{
            console.log(resp);
            this.setState({
                missions: [...resp]
            });
        }).catch(error=>{
            console.log(error);
            
        });
    }

    render(){

        let missionComponents = null;

        if(this.state.missions.length>0){
            missionComponents = this.state.missions.map(mission=>{
                return <MissionItem mission={mission} key={mission.mission_Id} userInfo={this.state.userInfo} />
            });
        } else {
            missionComponents = <p>Loading missions...</p>
        }

        return (
            <React.Fragment>
                <div>
                    {missionComponents}
                </div>
            </React.Fragment>
        )

    }
}

export default MissionList;