import React from 'react';
import Calendar from '@lls/react-light-calendar';
import '@lls/react-light-calendar/dist/index.css';
import styles from './NewMissionForm.module.css';
import { DatePicker, RangePicker, theme } from 'react-trip-date';
import {ThemeProvider} from 'styled-components';

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
            description: '',
            zombie_Visible: false,
            human_Visible: false,
            isVisible: false,
            start_time: new Date(startDate).toLocaleString(), 
            end_time: new Date(endDate).toLocaleString(),
        }
    }

    updateInputValue = (name, e) => {
        this.setState({ [name]: e.target.value});
    }

    showForm = ()=>{
        this.setState({
            isVisible: !this.state.isVisible
        });
        document.getElementById("showForm").style.display = 'none';
    }

    // onCalenderChange = (start_time, end_time) => {
    //     console.log(start_time);
    //     console.log(end_time);
        
    //     this.setState({
    //         start_time: new Date(start_time).toLocaleString(),
    //         end_time: new Date(end_time).toLocaleString()
    //     })
    // }
    onCalendarChange = (days) => {
        if(days.length == 1) {
            this.setState({
                start_time: new Date(days[0]).toLocaleString(),
                end_time: new Date(days[days.length-1]).toLocaleString()
            })
        } else if (days[0] < days[1]) {
            this.setState({
                start_time: new Date(days[0]).toLocaleString(),
                end_time: new Date(days[1]).toLocaleString()
            })
        } else {
            this.setState({
                start_time: new Date(days[1]).toLocaleString(),
                end_time: new Date(days[0]).toLocaleString()
            })
        }
    }

    handleCloseClick = () => {
        this.setState({
            isVisible: !this.state.isVisible
        });
        document.getElementById("showForm").style.display = 'block';
    }

    onClickCreate = async () => {
        // console.log("this works");
        console.log("you are reaching the onclickcreate function");

        var newMission= {
            name: this.state.name,
            is_Human_Visible: this.state.human_Visible,
            is_Zombie_Visible: this.state.zombie_Visible,
            description: this.state.description,
            game_Id: this.props.game_id,
            latitude: this.state.lat,
            longitude: this.state.lng,
            start_Time: this.state.start_time,
            end_Time: this.state.end_time
        }

        console.log(newMission);

        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.props.game_id}/mission`

        // console.log(JSON.stringify(bite));
        
        await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + this.props.userInfo.token
            },
            body: JSON.stringify(newMission)
        }).then(resp =>{
            console.log(resp);
            console.log('you are indeed getting a response');
            
        }).catch(error => {
            console.log('you are indeed getting an error');
            
            console.log(error);
        })
        
        this.handleCloseClick();
        this.props.onUpdateMissions();
        


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

        const  handleResponsive  =  setNumberOfMonth  =>  {
            let  width  =  document.querySelector('.tp-calendar').clientWidth;
            if  (width  >  900)  {
                setNumberOfMonth(3);
            }  else  if  (width  <  900  &&  width  >  580)  {
                setNumberOfMonth(2);
            }  else  if  (width  <  580)  {
                setNumberOfMonth(1);
            }
        };
        
        const  Day = ({  day  }) => {
            return  (
                <>
                    <p  className="date">{day.format('DD')}</p>
                </>
            );
        };

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
                        <label>Description:</label>
                            <input value={this.state.description} onChange={(e) => this.updateInputValue("description", e)} placeholder="Enter a description here..." type="text" />
                        <label>Visibility:</label><br/>
                            <label><input onClick={this.humanVisible} type="checkbox" value="Human"/>Human</label>
                            <label><input onClick={this.zombieVisible} type="checkbox"/>Zombie</label>
                        <label>Latitude:</label>
                            <input value={this.state.lat} onChange={(e) => this.updateInputValue("lat", e)} placeholder="Enter a latitude here..." type="text" />
                        <label>Longitude:</label>
                            <input value={this.state.lng} onChange={(e) => this.updateInputValue("lng", e)} placeholder="Enter a longitude here..." type="text" />
                        <label>Start and End Time</label>
                            {/* <Calendar className={styles.calendar} startDate={startDate} endDate={endDate} onChange={this.onCalenderChange} range displayTime timezone="Europe/Oslo"/> */}
                            <ThemeProvider theme={theme}>
                                <DatePicker
                                handleChange={(days) => this.onCalendarChange(days)}
                                // selectedDays={[startDate]} //initial selected days
                                jalali={false}
                                numberOfMonths={3}
                                numberOfSelectableDays={2} // number of days you need 
                                // disabledDays={['2019-12-02']} //disabeld days
                                responsive={handleResponsive} // custom responsive, when using it, `numberOfMonths` props not working
                                disabledBeforToday={true} 
                                disabled={false} // disable calendar 
                                dayComponent={Day} //custom day component 
                                // titleComponent={Title} // custom title of days
                                />
                            </ThemeProvider>
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