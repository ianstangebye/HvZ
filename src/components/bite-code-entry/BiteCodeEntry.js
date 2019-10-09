import React from 'react';
import Styles from './BiteCodeEntry.module.css';
import { isLVal } from '@babel/types';

class BiteCodeEntry extends React.Component (){
    state = {
        bite: '', 
    }

    componentDidMount() {

        // Get id from the button/game clicked on from the list? 
        //const {game_id} = this.props.match.params;
        
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/2`

        fetch(proxyUrl + targetUrl).then(resp => resp.json()).then(data => {
            this.setState({
                bite: {...data}
            });
        }).catch(e => {
            console.log(e);
        })
    }

    render(){
        return(
            <form>
                <label for="biteCode">Bite Code:</label>
                <input name="biteCode" type="text" />
            </form>
        )
    }
}

export default BiteCodeEntry;