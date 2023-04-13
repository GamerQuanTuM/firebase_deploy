import Auth from "./components/Auth";
import { db, auth, storage } from "../src/config/firebase";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import Image from "./components/Image";

function App() {
  const [movieList, setMovieList] = useState([]);

  //New Movie States
  const [newMovieTile, setNewMovieTile] = useState("");
  const [newMovieReleaseDate, setNewMovieReleaseDate] = useState(0);
  const [newMovieReceivedAward, setNewMovieReceivedAward] = useState(false);
  const [newMovieReviews1, setNewMovieReviews1] = useState("");
  const [newMovieReviews2, setNewMovieReviews2] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");

  async function getMovieList() {
    //READ THE DATA FROM DATABASE AND SET THE STATE
    try {
      const response = await getDocs(collection(db, "movies"));
      const filteredData = response.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(collection(db, "movies"), {
        title: newMovieTile,
        releaseDate: newMovieReleaseDate,
        awards: newMovieReceivedAward,
        reviews: arrayUnion(newMovieReviews1, newMovieReviews2),
        userId: auth?.currentUser?.uid,
      });
      getMovieList();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMovie = async (id) => {
    await deleteDoc(doc(db, "movies", id));
    getMovieList();
  };
  const updateMovieTitle = async (id) => {
    await updateDoc(doc(db, "movies", id), { title: updatedTitle });
    getMovieList();
  };


  return (
    <div className="App">
      <Auth />
      <div>Logged in :{auth ? auth?.currentUser?.email : ""}</div>
      <div>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <div>{movie.title}</div>
            <div>{movie.releaseDate}</div>
            <div>
              Awards:
              <>
                {movie.awards === true ? (
                  <span>Received an oscar</span>
                ) : (
                  <span>Didnt received an oscar</span>
                )}
              </>
            </div>
            <ul>
              Reviews :{" "}
              {movie.reviews.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <button onClick={() => deleteMovie(movie.id)}>Del</button>
            <input
              type="text"
              placeholder="New Title"
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <button
              disabled={updatedTitle.length === 0}
              onClick={() => updateMovieTitle(movie.id)}
            >
              Update
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <input
          style={{ width: "100px", height: "30px" }}
          type="text"
          placeholder="Movie title..."
          onChange={(e) => setNewMovieTile(e.target.value)}
        />
        <input
          style={{ width: "100px", height: "30px" }}
          type="number"
          placeholder="Movie release date..."
          onChange={(e) => setNewMovieReleaseDate(parseInt(e.target.value))}
        />
        <label>Received an Oscar</label>
        <input
          type="checkbox"
          checked={newMovieReceivedAward}
          onChange={(e) => setNewMovieReceivedAward(e.target.checked)}
        />
        <input
          style={{ width: "100px", height: "30px" }}
          type="text"
          placeholder="Movie Reviews..."
          onChange={(e) => {
            setNewMovieReviews1(e.target.value);
          }}
        />
        <input
          style={{ width: "100px", height: "30px" }}
          type="text"
          placeholder="Movie Reviews..."
          onChange={(e) => {
            setNewMovieReviews2(e.target.value);
          }}
        />
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
     <Image/>
    </div>
  );
}

export default App;
