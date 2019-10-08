import React from 'react';
import Styles from './NewGameForm.module.css';

class NewGameForm extends React.Component{

    
    render (){
        return (
            <form className={Styles.form}>
                <label htmlFor="gameName">Game Name</label>
                <input name="gameName" type="text" />
                <label htmlFor="gameStart">Game start date:</label>
                <input name="gameStart"/>
                <label htmlFor="lat">Latitude</label>
                <input name="lat"/>
                <label htmlFor="long">Longitude</label>
                <input name="long"/>     
                <button type="submit">Create new Game</button>
            </form>
        )
    }

}

export default NewGameForm;