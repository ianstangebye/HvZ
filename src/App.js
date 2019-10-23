import React from 'react';
import {Route} from 'react-router-dom';
import Header from './components/header/Header';
import GameList from './components/game-list-item/GameList';
import BiteCodeEntry from './components/bite-code-entry/BiteCodeEntry';
import MapFragment from './components/map-fragment/MapFragment';
import MapFragTest from './components/map-frag-test/MapFragTest';
import GoogleMap from './components/google-map/GoogleMap';
import LoginForm from './components/login-form/LoginForm';
import RegisterForm from './components/register-form/RegisterForm'
import GameDetail from './components/game-detail/GameDetail';
import NewGameForm from './components/new-game-form/NewGameForm';
import ChatFragment from './components/chat-fragment/ChatFragment';
import MissionList from './components/mission-list/MissionList';
import NewMissionForm from './components/new-mission-form/NewMissionForm';


function App() {
  return (
    <React.Fragment>
      <Header/>
      <Route path="/" exact component={GameList} />
      <Route path="/game/:game_id/kill" exact component={BiteCodeEntry} />
      <Route path="/map/:id" component={MapFragment} />
      {/* <Route path='/maptest/:id' component={MapFragTest} /> */}
      {/* <Route path='/maptest2/:id' component={MapFragTest2} /> */}
      <Route path='/googlemap/:id' component={GoogleMap} />

      <Route path='/login/' component={LoginForm} />
      <Route path='/register' component={RegisterForm} />
      <Route path='/game-detail/:game_id' component={GameDetail} />
      <Route path='/new-game-form/' component={NewGameForm} />
      <Route path='/chat-test/' component={ChatFragment} />
      <Route path='/missions' component={MissionList}/>
      <Route path='/new-mission' component={NewMissionForm}/>
    </React.Fragment>
  );
}

export default App;