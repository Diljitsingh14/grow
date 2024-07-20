import { useEffect } from "react";
import {
  getFacebookLoginStatus,
  initFacebookSdk,
  fbLogin,
} from "@/utils/facebook";
import FacebookLoginButton from "./LoginButton";

export default function FBInit() {
  function login() {
    console.log("reached log in button");
    fbLogin().then((response) => {
      console.log(response);
      if (response.status === "connected") {
        console.log("Person is connected");
      } else {
        // something
      }
    });
  }

  return (
    <div>
      <FacebookLoginButton onClick={login} />
    </div>
  );
}
