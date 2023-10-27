import {GoogleLogin} from 'react-google-login';

const clientId = "501816916441-50t2r4ud6jsla2bu3a4ggtdg8vbumocm.apps.googleusercontent.com"

function Login() {
  const onSuccess = (res) => {
    console.log("loginSucess", res.profileObj);
  }

  const onFailure = (res) => {
    console.log("login failed", res);
  }

  return(
    <div id="signInButton">
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy='single_host_origin'
        isSignedIn={true}
      />
    </div>
  )
}

export default Login;