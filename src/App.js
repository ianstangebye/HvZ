import React from 'react';
import {Route} from 'react-router-dom';
import GameList from './components/game-list-item/GameList';
import BiteCodeEntry from './components/bite-code-entry/BiteCodeEntry';
import MapFragment from './components/map-fragment/MapFragment';
import MapFragTest from './components/map-frag-test/MapFragTest';

function App() {
  return (
    <React.Fragment>
      <Route path="/" exact component={GameList} />
      <Route path="/gamebite" exact component={BiteCodeEntry} />
      <Route path="/map/:id" component={MapFragment} />
      <Route path='/maptest/:id' component={MapFragTest} />

    </React.Fragment>
  );
}

export default App;
