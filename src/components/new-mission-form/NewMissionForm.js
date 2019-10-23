import React from 'react';
import Calendar from '@lls/react-light-calendar';
import '@lls/react-light-calendar/dist/index.css';
import styles from './NewMissionForm.module.css';
import { isLVal } from '@babel/types';

class NewMissionForm extends React.Component {

    constructor(props){
        super(props);
        
        const date = new Date()
        const startDate = date.getTime()
        const endDate = new Date(startDate).setDate(date.getDate() + 1);
        
        this.state= {
            name: '',
            lat: null,
            lng: null,
            zombie_Visible: false,
            human_Visible: false,
            isVisible: false,
            start_time: new Date(startDate).toLocaleString(), 
            end_time: new Date(endDate).toLocaleString(),
        }
    }

    showForm = ()=>{
        this.setState({
            isVisible: !this.state.isVisible
        });
        document.getElementById("showForm").style.display = 'none';
    }

    onCalenderChange = (start_time, end_time) => {
        console.log(start_time);
        console.log(end_time);
        
        this.setState({
            start_time: new Date(start_time).toLocaleString(),
            end_time: new Date(end_time).toLocaleString()
        })
    }

    handleCloseClick = () => {
        this.setState({
            isVisible: !this.state.isVisible
        });
        document.getElementById("showForm").style.display = 'block'
    }

    onClickCreate = async () => {
        // console.log("this works");
        console.log("you are reaching the onclickcreate function");
        
        this.props.newMission();
        


    }

    humanVisible = ()=>{
        this.setState({
            human_Visible: !this.state.human_Visible
        })
    }

    zombieVisible = () =>{
        this.setState({
            zombie_Visible: !this.state.zombie_Visible
        })
    }


    render(){

        const startDate = new Date(this.state.start_time).getTime()
        const endDate = new Date(this.state.end_time).getTime()

        return(
            <React.Fragment>
                <div className={styles.SquadCreationFragment}>
                    <div className={styles.ShowForm} id="showForm">
                        <button className={styles.ShowFormBtn} type="button" onClick={this.showForm}>+</button>
                    </div> 
                </div>

                <div className={styles.CreationForm} style={{display: this.state.isVisible ? 'block' : 'none'}}>
                    <h2>Add new mission marker</h2>
                    <form>
                        <label>Name:</label>
                            <input autoFocus type="text" placeholder="Mission name here..." value={this.state.name} onChange={(e) => this.updateInputValue("name", e)} required/>
                        <label>Visibility:</label><br/>
                            <label><input onClick={this.humanVisible} type="checkbox" value="Human"/>Human</label>
                            <label><input onClick={this.zombieVisible} type="checkbox"/>Zombie</label>
                        <label>Latitude:</label>
                            <input value={this.state.lat} onChange={(e) => this.updateInputValue("lat", e)} placeholder="Enter a latitude here..." type="text" />
                        <label>Longitude:</label>
                            <input value={this.state.lng} onChange={(e) => this.updateInputValue("lng", e)} placeholder="Enter a longitude here..." type="text" />
                        <label>Start and End Time</label>
                            <Calendar className={styles.calendar} startDate={startDate} endDate={endDate} onChange={this.onCalenderChange} range displayTime timezone="Europe/Oslo"/>
                    </form>
                    <button className={styles.CreateBtn} onClick={() => {
                            this.onClickCreate();
                            //this.onClickJoin();
                        }}>Create Mission</button>
                        <button className={styles.CloseBtn} onClick={this.handleCloseClick}>Close</button>

                </div>

            </React.Fragment>
        )
    }



}

export default NewMissionForm;