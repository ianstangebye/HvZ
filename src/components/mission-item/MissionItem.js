import React, {useState, useEffect} from 'react';

function MissionItem (props){

    const { mission } = props;


    useEffect(()=>{
        console.log(mission.start_Time);
        

    });
    // const[data, setData] = useState();

    // useEffect(async()=>{
    //     const game_id = mission.game_Id;
    //     const mission_id = mission.mission_Id;
    //     const url= `http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/mission/${mission_id}`;

    //     await fetch(url).then(resp=>resp.json())
    //     .then(resp=>{
    //         console.log(resp);
    //         setData(resp);
    //     }).catch(error=>{
    //         console.log(error);
            
    //     });

    // });

    return (
        <div>
            <h4>{mission.name}</h4>
            <p>{mission.description}</p>
        </div>
    )


}

export default MissionItem;