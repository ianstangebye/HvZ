import React from 'react';
import styles from './SquadListItem.module.css';

function SquadListItem(props) {

    const { squad } = props;

    return (
        <div className={styles.SquadListItem}>
            <h4>{squad.name}</h4>
            <p className={styles.Total}>Total # of players: 12</p>
            <p className={styles.Deceased}>Deceased players: 3</p>
            <button onClick={ () => props.joinSquad()}>Join {squad.name}</button>
        </div>
    )

}

export default SquadListItem;