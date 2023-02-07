import {
  signInWithGooglePopup,
  createUserDocumentFromAuth,
} from "../../utils/firebase/firebase.utils";

import SignUpForm from "../../components/sign-up-form/sign-up-form";

const SignIn = () => {
  const logInGoogleUser = async () => {
    const { user: userAuth } = await signInWithGooglePopup();
    const userDocRef = await createUserDocumentFromAuth(userAuth);
  };

  return (
    <div>
      <h1>Sign in page</h1>
      <button onClick={logInGoogleUser}>Sign in with Google Popup </button>
      <SignUpForm />
    </div>
  );
};

export default SignIn;
