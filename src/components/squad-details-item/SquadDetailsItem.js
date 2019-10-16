import React from 'react';
import styles from './SquadDetailsItem.module.css';

function SquadDetailsItem(props) {

    const {squadMember} = props;

    let squadMemberState;

    if (squadMember.is_Human === true) {
        squadMemberState = 'Alive'
    } else {
        squadMemberState = 'Deceased'
    }

    return(
        <div className={styles.SquadDetailsItem}>
            <p>{squadMember.username}</p>
            <p>{squadMember.rank}</p>
            <p>{squadMemberState}</p>
        </div>
    )

}

export default SquadDetailsItem;