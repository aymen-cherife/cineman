import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
} from "@ionic/react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ManageUsers = () => {
  const [usersList, setUsersList] = useState([]); // Static array for users

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsersList(usersData); // Load users once
    };
    fetchUsers();
  }, []);

  const toggleDisabled = async (userId, currentStatus) => {
    try {
      const userDoc = doc(db, "users", userId);
      const newStatus = !currentStatus;
      await updateDoc(userDoc, { disabled: newStatus });

      // Update local usersList directly
      setUsersList((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, disabled: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user status.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Manage Users</IonTitle>
       </IonToolbar>
      </IonHeader>
  <IonContent className="ion-padding">
  {/* Header for Users Table */}
  <IonItem >
    <IonLabel>
      <h2 style={{ fontWeight: "bold", fontSize: "1.2em" }}>Users</h2>
    </IonLabel>
  </IonItem>

  {/* Users List */}
  <IonList>
    {usersList.map((user) => (
      <IonItem key={user.id}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px", width: "100%" }}>
        {/* User Image */}
        <img
          src={user.photoBase64 || "https://via.placeholder.com/50"} // Default placeholder image
          alt={`${user.name} ${user.surname}`}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
    
        {/* User Information */}
        <IonLabel style={{ flex: "1" }}>
          <h2>{user.name + " " + user.surname}</h2>
          <p>{user.email}</p>
        </IonLabel>
    
        {/* Disabled Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <IonLabel style={{ fontSize: "0.9em", color: "gray" }}>Disabled</IonLabel>
          <IonToggle
            checked={!user.disabled}
            onIonChange={() => toggleDisabled(user.id, user.disabled)}
          />
        </div>
      </div>
    </IonItem>
    
    ))}
  </IonList>
</IonContent>

    </IonPage>
  );
};

export default ManageUsers;
