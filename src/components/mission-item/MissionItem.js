import React from 'react';

function MissionItem (props){

    const { mission } = props;

    return (
        <div>
            <h4>{mission.name}</h4>
            <p>{mission.description}</p>
        </div>
    )


}

export default MissionItem;