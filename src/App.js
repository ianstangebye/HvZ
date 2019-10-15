import React from 'react';
import {Route} from 'react-router-dom';
import Header from './components/header/Header';
import GameList from './components/game-list-item/GameList';
import BiteCodeEntry from './components/bite-code-entry/BiteCodeEntry';
import MapFragment from './components/map-fragment/MapFragment';
import MapFragTest from './components/map-frag-test/MapFragTest';
import MapFragTest2 from './components/map-frag-test2/MapFragTest2';
import GoogleMap from './components/google-map/GoogleMap';
import LoginForm from './components/login-form/LoginForm';
import GameDetail from './components/game-detail/GameDetail';
import NewGameForm from './components/new-game-form/NewGameForm';
import ChatFragment from './components/chat-fragment/ChatFragment';


function App() {
  return (
    <React.Fragment>
      <Header/>
      <Route path="/" exact component={GameList} />
      <Route path="/gamebite" exact component={BiteCodeEntry} />
      <Route path="/map/:id" component={MapFragment} />
      {/* <Route path='/maptest/:id' component={MapFragTest} /> */}
      {/* <Route path='/maptest2/:id' component={MapFragTest2} /> */}
      <Route path='/googlemap/:id' component={GoogleMap} />

      <Route path='/maptest/:id' component={MapFragTest} />
      <Route path='/login/' component={LoginForm} />
      <Route path='/game-detail/:game_id' component={GameDetail} />
      <Route path='/new-game-form/' component={NewGameForm} />
      <Route path='/chat-test/' component={ChatFragment} />
    </React.Fragment>
  );
}

export default App;