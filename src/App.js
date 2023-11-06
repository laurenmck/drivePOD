import './App.css';
import { gapi } from 'gapi-script';
import { useState } from 'react';
// import Login from './components/login';
// import Logout from './components/logout';
import useGoogle from "./auth/useGoogle";
import FHIR_to_summary from './Parsing';
// import objectToFormData from './Parsing'

function App() {
  //for Auth
  const { token, authorize, revoke } = useGoogle();

  const [summary, setSummary] = useState('Nothing Here Yet');
  const [loadUrl, setLoadUrl] = useState('http://orenkohavi.github.io/FHIRData/FHIR_Reference');
  const [file, setFile] = useState('');

  
  const handleImportClick = async () => {
    try {
      const response = await fetch(loadUrl);
      const data = await response.text(); // assuming the URL returns text
    
      const summaryText = FHIR_to_summary(data);
      setFile(data);
      setSummary(summaryText);
    } catch (error) {
      console.error('Error fetching or processing data:', error);
      setSummary('Error loading summary.');
    }
  };

  const handleLoadClick = async (e) => {
    try {
      //TODO: get upload loaded data to google drive
      var request = window.gapi.client.request({
        'path': 'https://www.googleapis.com/upload/drive/v3/files',
        'method': 'POST',
        'params': {'uploadType': 'media'}, //TODO: edit this to a multi part upload to add name/metadata
        'headers': {
          'Authorization': "Bearer " + token
        },
        'body': file});
    request.execute(function(file) {
      console.log("file uploaded to drive", file);
      setSummary("File Uploaded to Drive");
    });
    } catch (error){
      console.error('Error fetching or processing data:', error);
      setSummary('Error loading summary.');
    }
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete?')) {
      setSummary('Nothing Here');
      //TODO: Clear the actual google drive file (?)
    }
  };

  const summaryStyle = {
    color: 'white',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    width: '60vw',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    margin: 'auto',
    whiteSpace: 'pre-line'
  };

const buttonStyle = {
  padding: '10px 20px',
  margin: '0 10px',
  fontSize: '16px',
  cursor: 'pointer',
  display: 'inline-block',
};

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <div id='GoogleLoginDiv'>
          <button onClick={token ? revoke : authorize} type="button" style={buttonStyle}>
            {token ? "Log-Out" : "authorize"}
          </button>
          {/* <Login/>
          <br/>
          <Logout/> */}
          </div>
          <br></br>
          <div style={{ textAlign: 'center' }}>
            <hr style={{ width: '33%', margin: '0 auto' }}></hr>
          </div>
          <div id='Summary'>
            <div id='SummaryButtons' style={{ display: 'inline-block', textAlign: 'center', margin: '20px' }}>
              <button onClick={handleImportClick} style={buttonStyle}>Import</button>
              <button onClick={handleLoadClick} style={buttonStyle}>Load</button>
              <button onClick={handleDeleteClick} style={buttonStyle}>Delete</button>
            </div>
            <div id='SummaryURL' style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
                <label htmlFor="urlInput" style={{ marginRight: '10px' }}>URL:</label>
                <input 
                  id="urlInput" 
                  type="text" 
                  value={loadUrl}
                  onChange={(e) => setLoadUrl(e.target.value)}
                  style={{ padding: '10px', marginRight: '10px' }}
                />
                <button 
                  onClick={() => setLoadUrl("http://orenkohavi.github.io/FHIRData/FHIR_Reference")}
                  style={{ padding: '10px' }}
                >
                  Reset URL
                </button>
              </div>
            </div>
            <br></br>
            <div id='SummaryText'>
              <div 
                style={summaryStyle}
                readOnly
              >
                {summary}
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;