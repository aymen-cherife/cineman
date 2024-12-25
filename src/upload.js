import movies from './movies.json' assert { type: "json" }; // Add the assertion
import { db } from './firebaseConfig.js'; // Your Firebase configuration file
import { collection, addDoc } from "firebase/firestore";

const uploadMovies = async () => {
    const moviesCollection = collection(db, "movies"); // Collection name: "movies"
    for (const movie of movies) {
        try {
            await addDoc(moviesCollection, movie);
            console.log(`Uploaded: ${movie.Title}`);
        } catch (error) {
            console.error(`Failed to upload ${movie.Title}:`, error);
        }
    }
};

uploadMovies();
