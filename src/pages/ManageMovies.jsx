import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ManageMovies = () => {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [director, setDirector] = useState("");
  const [poster, setPoster] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Add a new movie to Firestore
  const addMovie = async () => {
    if (!title || !year || !genre || !director || !poster) {
      alert("Please fill in all fields!");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "movies"), {
        Title: title,
        Year: year,
        Genre: genre,
        Director: director,
        Poster: poster,
      });
      alert("Movie added successfully!");
      setTitle("");
      setYear("");
      setGenre("");
      setDirector("");
      setPoster("");
      fetchMovies(); // Refresh movie list
    } catch (error) {
      console.error("Error adding movie:", error);
      alert("Failed to add movie.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin - Manage Movies</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Movies List</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {movies.map((movie) => (
                <IonItem key={movie.id}>
                  <IonLabel>
  <h2 className="ion-text-bold" style={{ fontSize: "1.2em", marginBottom: "5px" }}>
    {movie.Title}
  </h2>
  <p>
    <strong>Release Year:</strong> {movie.Year}
  </p>
  <p>
    <strong>Genre:</strong> {movie.Genre}
  </p>
  <p>
    <strong>Director:</strong> {movie.Director}
  </p>
</IonLabel>

                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Add New Movie</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonInput
                    placeholder="Title"
                    value={title}
                    onIonChange={(e) => setTitle(e.detail.value)}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonInput
                    placeholder="Year"
                    type="number"
                    value={year}
                    onIonChange={(e) => setYear(e.detail.value)}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonInput
                    placeholder="Genre"
                    value={genre}
                    onIonChange={(e) => setGenre(e.detail.value)}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonInput
                    placeholder="Director"
                    value={director}
                    onIonChange={(e) => setDirector(e.detail.value)}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonInput
                    placeholder="Poster URL"
                    value={poster}
                    onIonChange={(e) => setPoster(e.detail.value)}
                  />
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonButton expand="block" onClick={addMovie} disabled={loading}>
                    {loading ? "Adding..." : "Add Movie"}
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

export default ManageMovies;
