import React from 'react';
import MissionItem from '../mission-item/MissionItem';

class MissionList extends React.Component{

    state = {
        missions: []
    }


    componentDidMount(){

        const game_id = this.props.game_id;


        fetch(`http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/mission`).then(resp=>resp.json())
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
                return <MissionItem mission={mission} key={mission.id}/>
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