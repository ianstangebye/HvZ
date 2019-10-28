import React from 'react';
import '@lls/react-light-calendar/dist/index.css';
import styles from './NewMissionForm.module.css';
import { DatePicker, theme } from 'react-trip-date';
import {ThemeProvider} from 'styled-components';
import backEndUrl from '../../backEndUrl';

class NewMissionForm extends React.Component {

    constructor(props){
        super(props);
        
        const date = new Date()
        const startDate = date.getTime()
        const endDate = new Date(startDate).setDate(date.getDate() + 1);
        
        this.state= {
            name: '',
            lat: 0,
            lng: 0,
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
    //     // console.log(start_time);
    //     // console.log(end_time);
        
    //     this.setState({
    //         start_time: new Date(start_time).toLocaleString(),
    //         end_time: new Date(end_time).toLocaleString()
    //     })
    // }
    onCalendarChange = (days) => {
        if(days.length === 1) {
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
        // // console.log("this works");
        // console.log("you are reaching the onclickcreate function");

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

        // console.log(newMission);

        const targetUrl = backEndUrl + `${this.props.game_id}/mission`

        // // console.log(JSON.stringify(bite));
        
        await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer ' + this.props.userInfo.token
            },
            body: JSON.stringify(newMission)
        })
        // .then(resp =>{
        //     // console.log(resp);
        //     // console.log('you are indeed getting a response');
            
        // })
        .catch(error => {
            // console.log('you are indeed getting an error');
            
            console.error(error);
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

        //const startDate = new Date(this.state.start_time).getTime()
        //const endDate = new Date(this.state.end_time).getTime()

        return(
            <React.Fragment>
                <div className={styles.NewMissionForm}>
                    <div className={styles.ShowForm} id="showForm">
                        <button className={styles.ShowFormBtn} type="button" onClick={this.showForm}>+</button>
                    </div> 

                    <div className={styles.CreationForm} style={{display: this.state.isVisible ? 'block' : 'none'}}>
                        <h2>Add new mission marker</h2>
                        <form>
                            <label className={styles.Label}>Name:</label>
                                <input className={styles.Input} autoFocus type="text" placeholder="Mission name here..." value={this.state.name} onChange={(e) => this.updateInputValue("name", e)} required/>
                            <label className={styles.Label}>Description:</label>
                                <input className={styles.Input} value={this.state.description} onChange={(e) => this.updateInputValue("description", e)} placeholder="Enter a description here..." type="text" />
                            <label className={styles.Label}>Visibility:</label>
                                <div className={styles.VisibilityHuman}>
                                    <label className={styles.VisibilityLabel} htmlFor="human">Human</label>
                                    <input className={styles.CheckBox} onClick={this.humanVisible} name="human" type="checkbox" value="Human"/>
                                </div>
                                <div className={styles.VisibilityZombie}>
                                    <label className={styles.VisibilityLabel} htmlFor="zombie">Zombie</label>
                                    <input className={styles.CheckBox} onClick={this.zombieVisible} name="zombie" type="checkbox"/>
                                </div>
                            <label className={styles.Label}>Latitude:</label>
                                <input className={styles.Input} value={this.state.lat} onChange={(e) => this.updateInputValue("lat", e)} placeholder="Enter a latitude here..." type="text" />
                            <label className={styles.Label}>Longitude:</label>
                                <input className={styles.Input} value={this.state.lng} onChange={(e) => this.updateInputValue("lng", e)} placeholder="Enter a longitude here..." type="text" />
                            <label className={styles.Label}>Start and End Time</label>
                                {/* <Calendar className={styles.calendar} startDate={startDate} endDate={endDate} onChange={this.onCalenderChange} range displayTime timezone="Europe/Oslo"/> */}
                                <div className={styles.CalendarContainer}>
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
                                </div>
                        </form>
                        <button className={styles.CreateBtn} onClick={() => {
                                this.onClickCreate();
                                //this.onClickJoin();
                            }}>Create Mission</button>
                            <button className={styles.CloseBtn} onClick={this.handleCloseClick}>Close</button>

                    </div>
                </div>
                

            </React.Fragment>
        )
    }



}

export default NewMissionForm;