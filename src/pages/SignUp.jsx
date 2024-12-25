import React, { useState } from "react";
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
} from "@ionic/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

const SignUp = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState("");

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera, // Use camera directly
        quality: 90,
      });

      setPhoto(image.dataUrl); // Store photo in state
    } catch (error) {
      console.error("Camera error:", error);
      alert("Failed to access the camera. Please try again.");
    }
  };

  const handleSignUp = async () => {
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Store user data in Firestore, including the Base64 photo
      await setDoc(doc(db, "users", user.uid), {
        name,
        surname,
        age,
        email,
        photoBase64: photo, // Store Base64 photo in Firestore
      });

      alert("Account created successfully!");
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Failed to create account. Please try again.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ backgroundColor: "white" }}>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Create Your Account</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonInput
                    placeholder="First Name"
                    onIonChange={(e) => setName(e.detail.value)}
                  />
                </IonCol>
                <IonCol>
                  <IonInput
                    placeholder="Last Name"
                    onIonChange={(e) => setSurname(e.detail.value)}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonInput
                    placeholder="Age"
                    type="number"
                    onIonChange={(e) => setAge(e.detail.value)}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonInput
                    placeholder="Email"
                    type="email"
                    onIonChange={(e) => setEmail(e.detail.value)}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonInput
                    placeholder="Password"
                    type="password"
                    onIonChange={(e) => setPassword(e.detail.value)}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonButton expand="block" onClick={takePhoto}>
                    Take Photo
                  </IonButton>
                </IonCol>
              </IonRow>
              {photo && (
                <IonRow>
                  <IonCol>
                    <img
                      src={photo}
                      alt="Profile"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        marginTop: "10px",
                      }}
                    />
                  </IonCol>
                </IonRow>
              )}
              <IonRow>
                <IonCol>
                  <IonButton expand="block" onClick={handleSignUp}>
                    Sign Up
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

export default SignUp;
