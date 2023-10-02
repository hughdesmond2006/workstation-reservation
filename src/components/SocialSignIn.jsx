import { auth } from "../../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";

/*  
  Simple firebase google account sign in.
  In a more detailed prototype, I would be controlling the viewing and booking of slots by first 
  ensuring the user has a valid & unexpired login token. We can also store the users details in
  the database and come up with a generic structure for storeing users who signed in or registered
  using various other methods like Facebook/Microsoft etc. 
 */
function SocialSignIn() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log("boop", provider);
      const res = await signInWithPopup(auth, provider);

      setUserId(res.user.uid);
      setEmail(res.user.email);

      console.log("google user", res.user);
    } catch (error) {
      console.log("err", error);
    }
  };

  return (
    <div>
      {userId ? (
        <h5 style={{ margin: 0 }}>signed in as {email}</h5>
      ) : (
        <button onClick={handleGoogleSignIn}>Sign In with Google</button>
      )}
    </div>
  );
}

export default SocialSignIn;
