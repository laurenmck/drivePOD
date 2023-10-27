import { GoogleLogout } from "react-google-login";

const clientId = "501816916441-50t2r4ud6jsla2bu3a4ggtdg8vbumocm.apps.googleusercontent.com"

function Logout() {

  const onSuccess = () => {
    console.log("logout successful");
  }

  return(
    <div id="signOutButton">
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  )
}

export default Logout;