import { useEffect, useState } from "react";
import GOOGLE from "../google.json";
import useScript from "./useScript";
import useIsMounted from "./isMounted";

//TODO:: ADD CATCH BLOCKS IF AUTH FAILS

function useGoogle() {
  const loaded = useScript("https://apis.google.com/js/api.js");
  const [token, setToken] = useState("");
  const mounted = useIsMounted();

  useEffect(() => {
    function update(google) {
      setToken(google ? google.getAuthResponse().access_token : "");
    }
    if (loaded)
      window.gapi.load("auth2:picker:client", async () => {
        await window.gapi.auth2.init({
          apiKey: GOOGLE.API_KEY,
          clientId: GOOGLE.CLIENT_ID,
          discoveryDocs: GOOGLE.DISCOVERY_DOCS,
          scope: GOOGLE.SCOPES
        });
        if (mounted.current) {
          const instance = window.gapi.auth2.getAuthInstance();
          instance.currentUser.listen(update);
          update(instance.currentUser.get());
        }
      });
  }, [mounted, loaded]);

  async function authorize() {
    await window.gapi.auth2.getAuthInstance().signIn();
  }

  async function revoke() {
    await window.gapi.auth2.getAuthInstance().disconnect();
  }

  return { token, authorize, revoke };
}

export default useGoogle;
