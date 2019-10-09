import React from 'react';
import {Route} from 'react-router-dom';
import GameList from './components/game-list-item/GameList';


function App() {
  return (
    <React.Fragment>
      <Route path="/" exact component={GameList} />

    </React.Fragment>
  );
}

export default App;
