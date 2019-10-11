import React from 'react';
import {Route} from 'react-router-dom';
import GameList from './components/game-list-item/GameList';
import BiteCodeEntry from './components/bite-code-entry/BiteCodeEntry';
import MapFragment from './components/map-fragment/MapFragment';
import MapFragTest from './components/map-frag-test/MapFragTest';
import LoginForm from './components/login-form/LoginForm';
import GameDetail from './components/game-detail/GameDetail';

function App() {
  return (
    <React.Fragment>
      <Route path="/" exact component={GameList} />
      <Route path="/gamebite" exact component={BiteCodeEntry} />
      <Route path="/map/:id" component={MapFragment} />
      <Route path='/maptest/:id' component={MapFragTest} />
      <Route path='/login/' component={LoginForm} />
      <Route path='/game-detail/:game_id' component={GameDetail} />
    </React.Fragment>
  );
}

export default App;