import React from 'react';
import styles from './GameDetail.module.css';

class GameDetail extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            game_id: 0
        }
    }

    componentDidMount() {
        const { game_id }  = this.props.match.params;
        this.setState({game_id:game_id});
    }

    render() {
        return(
            <React.Fragment>
                <h1>Game Detail for game {this.state.game_id}</h1>
            </React.Fragment>
        )
    }
}

export default GameDetail
