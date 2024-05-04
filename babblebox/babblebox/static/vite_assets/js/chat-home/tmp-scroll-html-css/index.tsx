import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home';
import {ChatDetails} from './chat-details';


export const App = () => (
  <Router>
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats/:chatId" element={<ChatDetails chatId='' />} />
      </Routes>
    </div>
  </Router>
);

const ChatList = () => <div>List of Chats</div>;
const ChatDetail = () => {
  const { chatId } = useParams();
  return <div>Details of Chat {chatId}</div>;
};


const rootElement = document.getElementById('root');
if (rootElement) {
  render(<App />, rootElement);
}
