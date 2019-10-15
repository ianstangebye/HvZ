import React from 'react';
import {Route} from 'react-router-dom';
import GameList from './components/game-list-item/GameList';
import BiteCodeEntry from './components/bite-code-entry/BiteCodeEntry';
import MapFragment from './components/map-fragment/MapFragment';
import MapFragTest from './components/map-frag-test/MapFragTest';
import MapFragTest2 from './components/map-frag-test2/MapFragTest2';
import GoogleMap from './components/google-map/GoogleMap';

function App() {
  return (
    <React.Fragment>
      <Route path="/" exact component={GameList} />
      <Route path="/gamebite" exact component={BiteCodeEntry} />
      <Route path="/map/:id" component={MapFragment} />
      {/* <Route path='/maptest/:id' component={MapFragTest} /> */}
      {/* <Route path='/maptest2/:id' component={MapFragTest2} /> */}
      <Route path='/googlemap/:id' component={GoogleMap} />

    </React.Fragment>
  );
}

export default App;