import logo from './greylogo.webp';
import './App.css';
import './ChatBox'
import ChatBox from './ChatBox';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="top-container">
          <img src={logo} className="App-logo" alt="logo" />
          <a
            className="App-link"
            href="https://fi.chat"
            target="_blank"
            rel="noopener noreferrer"
          >
            Back
          </a>
        </div>
        <div className="chat-container">
          <ChatBox />
        </div>
      </header>
    </div>
  );
}

export default App;
