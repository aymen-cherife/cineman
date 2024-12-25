import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonContent,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonButton,
  IonSpinner,
} from "@ionic/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useHistory } from "react-router-dom";

const Login = ({ setCurrentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    // Check if the user is already logged in
    const checkLoggedInUser = async () => {
      if (auth.currentUser) {
        const user = auth.currentUser;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && !userDoc.data().disabled) {
          setCurrentUser(user);
          history.push("/movies");
        }
      }
    };

    checkLoggedInUser();
  }, [setCurrentUser, history]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if the user is disabled
        if (userData.disabled) {
          alert("Your account has been disabled. Please contact support.");
          setLoading(false);
          return;
        }

        // Set user to the App state and redirect
        setCurrentUser(user);
        history.push("/movies");
      } else {
        alert("User record not found in Firestore. Please contact support.");
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("User not found. Please check your email or sign up.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else if (error.code === "auth/too-many-requests") {
        alert("Too many failed attempts. Please try again later.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ backgroundColor: "white" }}>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Welcome Back</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonInput
                    placeholder="Email"
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value)}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonInput
                    placeholder="Password"
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value)}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonButton expand="block" onClick={handleLogin} disabled={loading}>
                    {loading ? <IonSpinner /> : "Log In"}
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;
