import React from 'react';
import {Route} from 'react-router-dom';
import GameList from './components/game-list-item/GameList';
import NewGameForm from './components/new-game-form/NewGameForm';


function App() {
  return (
    <React.Fragment>
      <Route path="/" exact component={GameList} />
      <Route path="/form" exact component={NewGameForm} />

    </React.Fragment>
  );
}

export default App;
