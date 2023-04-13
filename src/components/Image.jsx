import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import React, { useState, useEffect } from "react";

function Image() {
  const [image, setImage] = useState(null);
  const [photos, setPhotos] = useState([]);

  const onImageUpload = () => {
    if (!image) return;
    uploadBytes(
      ref(
        storage,
        `demoFiles/${
          new Date().toLocaleString().split(",")[0].split("/").join("-") +
          "---" +
          image.name
        }`
      ),
      image
    ).then((snapshot) => {
      getDownloadURL(snapshot.ref).
        then((url) => {
          setPhotos((prev) => [...prev, url]);
        });
    });
  };

  useEffect(() => {
    listAll(ref(storage, "demoFiles/")).then((res) => {
      res.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setPhotos((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={onImageUpload}>Upload Image</button>
      {photos.map((photo, i) => (
        <img
          key={i}
          src={photo}
          style={{
            width: "200px",
            height: "200px",
          }}
        />
      ))}
    </div>
  );
}

export default Image;
