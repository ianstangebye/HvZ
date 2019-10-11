import React from 'react';
import {Route} from 'react-router-dom';
import GameList from './components/game-list-item/GameList';
import ChatFragment from './components/chat-fragment/ChatFragment';

function App() {
  return (
    <React.Fragment>
      <Route path="/" exact component={GameList} />
      <ChatFragment />
    </React.Fragment>
  );
}

export default App;