import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonContent,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/react";
import ManageUsers from "./ManageUsers"; // Placeholder: Create this next
import ManageMovies from "./ManageMovies"; // Rename your AdminMovies component to ManageMovies

const Admin = () => {
  const [selectedPage, setSelectedPage] = useState("movies");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Dashboard</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={selectedPage}
            onIonChange={(e) => setSelectedPage(e.detail.value)}
          >
            <IonSegmentButton value="movies">
              <IonLabel>Manage Movies</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="users">
              <IonLabel>Manage Users</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {selectedPage === "movies" && <ManageMovies />}
        {selectedPage === "users" && <ManageUsers />}
      </IonContent>
    </IonPage>
  );
};

export default Admin;
