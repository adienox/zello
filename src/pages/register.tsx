import { signInAnonymously, updateEmail, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { auth, db } from "@/firebase/clientApp";

const Register = () => {
  const [loading, setLoading] = useState(false);
  // anonRegister function to allow users to sign up anonymously
  const anonRegister = async () => {
    setLoading(true);
    try {
      // Sign in anonymously
      const userDetail = await signInAnonymously(auth);

      // Fetch user data from API
      const userData = await fetch(
        "https://randomuser.me/api/?inc=name,email,picture"
      )
        // parse response as JSON
        .then((res) => res.json())
        // extract the first result from the API response
        .then((data) => data.results[0]);

      // Destructure user data into variables (displayName, email, photoURL)
      const {
        name: { first, last },
        email,
        picture: { large: photoURL },
      } = userData;
      const displayName = `${first} ${last}`;

      // Set user data and blank userChats data in db with a single call
      await Promise.all([
        setDoc(doc(db, "users", userDetail.user.uid), {
          uid: userDetail.user.uid,
          displayName,
          email,
          photoURL,
        }),
        setDoc(doc(db, "userChats", userDetail.user.uid), {}),
      ]);

      // Update user profile with displayName and photoURL
      await updateProfile(userDetail.user, { displayName, photoURL });

      // Update user email
      await updateEmail(userDetail.user, email);

      // Redirect user
      Router.push("/");
    } catch (error) {
      setLoading(false);
      console.log(error); // Log error if any
    }
  };

  const user = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      Router.push("/");
    }
  });

  return (
    !user && (
      <div className="ml-auto h-[100vh] bg-[#20232b] p-5 md:w-[60vw] md:pt-[20vh] md:pl-[15vh]">
        <div className="text-center text-3xl text-white md:text-left md:text-5xl">
          <h1>Welcome to Zello,</h1>
          <h1>Sign Up to Continue.</h1>
        </div>
        <div className="mt-5 flex flex-col text-center text-white md:text-left">
          <span>Already have an account? Proceed to Login</span>
          <span>Welcome Aboard!</span>
        </div>
        <div className="mt-12 flex flex-col items-center lg:block">
          <button
            onClick={anonRegister}
            className="h-[50px] w-[90%] rounded-lg bg-black text-white disabled:cursor-not-allowed disabled:bg-black/30 lg:w-[500px]"
            disabled={loading}
          >
            Anonymous Login
          </button>
        </div>
      </div>
    )
  );
};

export default Register;
