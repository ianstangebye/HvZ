import React from 'react';
import styles from './SquadDetailsItem.module.css';

export default class SquadDetailsItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isAlive: null,
            memberStateColor: ''
        }
    }

    componentDidMount() {
        if (this.props.squadMember.is_Human === true) {
            this.setState({isAlive: 'Alive', memberStateColor: '#A7C57C'})
        } else {
            this.setState({isAlive: 'Deceased', memberStateColor: '#ED553B'})
        }
    }

    render() {
        return(
            <div className={styles.SquadDetailsItem}>
                <p>{this.props.squadMember.username}</p>
                <p>{this.props.squadMember.rank}</p>
                <p style={{color: this.state.memberStateColor}}>{this.state.isAlive}</p>
            </div>
        )
    }

}