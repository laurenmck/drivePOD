import './App.css';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import Login from './components/login';
import Logout from './components/logout';

const clientId = '501816916441-50t2r4ud6jsla2bu3a4ggtdg8vbumocm.apps.googleusercontent.com';

function App() {

  useEffect(() => {
    function start(){
      gapi.client.init({
        clientId: {clientId},
        scope: ""
      })
    };
    gapi.load('client:auth2', start);

  });

  return (
    <div className="App">
      <header className="App-header">
        <div>
        <Login/>
        <br/>
        <Logout/>
        </div>
      </header>
    </div>
  );
}

export default App;