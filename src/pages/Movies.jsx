import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonIcon,
  IonButton,
} from "@ionic/react";
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { starOutline, star } from "ionicons/icons";

const Movies = ({ currentUser }) => {
  const [movies, setMovies] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState("movies");
  const [favList, setFavList] = useState([]);

  // Redirect if no user is logged in
  if (!currentUser) {
    window.location.href = "/login"; // Redirect to login page
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  // Fetch movies from Firestore
  const fetchMovies = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "movies"));
      const moviesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovies(moviesData);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Fetch user's favorites from Firestore
  const fetchFavorites = async () => {
    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        setFavList(userDoc.exists() ? userDoc.data().favList || [] : []);
      } catch (error) {
        console.error("Error fetching user favorites:", error);
      }
    }
  };

  // Toggle favorite movies
  const toggleFavorite = async (movieId) => {
    const userDoc = doc(db, "users", currentUser.uid);

    try {
      if (favList.includes(movieId)) {
        await updateDoc(userDoc, {
          favList: arrayRemove(movieId),
        });
        setFavList((prev) => prev.filter((id) => id !== movieId));
      } else {
        await updateDoc(userDoc, {
          favList: arrayUnion(movieId),
        });
        setFavList((prev) => [...prev, movieId]);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchFavorites();
  }, []);

  const renderMovie = (movie) => (
    <IonItem key={movie.id}>
      <img
        src={movie.Poster}
        alt={movie.Title}
        style={{ width: "60px", height: "90px", marginRight: "10px" }}
      />
      <IonLabel>
        <h2>{movie.Title}</h2>
        <p>
          <strong>Year:</strong> {movie.Year}
        </p>
        <p>
          <strong>Genre:</strong> {movie.Genre}
        </p>
        <p>
          <strong>Director:</strong> {movie.Director}
        </p>
      </IonLabel>
      <IonIcon
        icon={favList.includes(movie.id) ? star : starOutline}
        style={{ fontSize: "24px", color: "gold", cursor: "pointer" }}
        onClick={() => toggleFavorite(movie.id)}
      />
    </IonItem>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Movies</IonTitle>
          <IonButton slot="end" onClick={handleLogout} color="danger">
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSegment
          value={selectedSegment}
          onIonChange={(e) => setSelectedSegment(e.detail.value)}
        >
          <IonSegmentButton value="movies">
            <IonLabel>Movies</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="favlist">
            <IonLabel>FavList</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {selectedSegment === "movies" && (
          <IonList>{movies.map((movie) => renderMovie(movie))}</IonList>
        )}

        {selectedSegment === "favlist" && (
          <IonList>
            {movies.filter((movie) => favList.includes(movie.id)).map((movie) => renderMovie(movie))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Movies;
