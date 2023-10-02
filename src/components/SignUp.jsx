import { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

// simple firebase user & email signup page, unused for the purpose of this prototype
function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      setUserId(res.user.uid);

      console.log("customToken", res.user.accessToken);
    } catch (error) {
      console.log("err", error);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Sign Up</button>
      {userId ? (
        <h5>
          signed in as {email} 
        </h5>
      ) : null}
    </div>
  );
}

export default SignUp;
