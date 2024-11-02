import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";
import { classifyWasteType } from "./wasteMapping.js";


// Use the variable as needed
// For example, in your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC63fKcQygMGxuaekB3LUhLHBrtePlgorc",
  authDomain: "plasware-pr.firebaseapp.com",
  projectId: "plasware-pr",
  storageBucket: "plasware-pr.appspot.com",
  messagingSenderId: "754561855795",
  appId: "1:754561855795:web:168f7ae976c39df1a0ce46",
  measurementId: "G-XKGCH0KJ5Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const wasteType = document.getElementById("waste-type");

// Initialize location input and suggestions
const locationInput = document.getElementById("location-name");
const suggestionsList = document.getElementById("location-suggestions");
const geocoder = L.Control.Geocoder.nominatim();

locationInput.addEventListener("input", function () {
  const query = locationInput.value;
  if (query.length > 2) {
    geocoder.geocode(query, function (results) {
      suggestionsList.innerHTML = ""; // Clear previous suggestions
      results.forEach(function (result) {
        const li = document.createElement("li");
        li.textContent = result.name;
        li.addEventListener("click", function () {
          document.getElementById("latitude").value = result.center.lat;
          document.getElementById("longitude").value = result.center.lng;
          locationInput.value = result.name;
          suggestionsList.innerHTML = "";
        });
        suggestionsList.appendChild(li);
      });
    });
  }
});

// Handle form submission
document
  .getElementById("submit-button")
  .addEventListener("click", function () {
    const name = document.getElementById("location-name").value;
    const address = document.getElementById("address").value;
    const wasteType = document.getElementById("waste-type").value;
    const description = document.getElementById("description").value;
    const imageFile = document.getElementById("image-upload").files[0];
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    if (
      name &&
      wasteType &&
      address &&
      description &&
      imageFile &&
      latitude &&
      longitude
    ) {
      uploadData(
        name,
        address,
        wasteType,
        description,
        imageFile,
        latitude,
        longitude
      );
    } else {
      alert("Please fill in all fields and select a location.");
    }
  });

// Upload data to Firebase
function uploadData(
  name,
  address,
  wasteType,
  description,
  imageFile,
  latitude,
  longitude
) {
  const storageRef = ref(storage, "images/" + imageFile.name);
  uploadBytes(storageRef, imageFile).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((downloadURL) => {
      addDoc(collection(db, "dumpingSites"), {
        name: name,
        address: address,
        wasteType: wasteType,
        description: description,
        imageUrl: downloadURL,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      })
        .then(() => {
          alert("Location submitted successfully!");
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("Error storing location:", error);
          alert("An error occurred while storing the location.");
        });
    });
  });
}

const URL = "./js/";

let model;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
}

document
  .getElementById("image-upload")
  .addEventListener("change", async function (event) {
    const feedbackDiv = document.getElementById("waste-type-feedback");
    feedbackDiv.textContent = "AI is analysing the waste type...";
    feedbackDiv.style.display = "block";

    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected for analysis.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;

      // Wait for the model to be loaded before analyzing
      if (!model) await init();

      const predictions = await model.predict(img);

      // // Filter predictions to find relevant waste types
      let foundWasteType = "";
      const newSorted = predictions.sort(
        (prev, next) => next.probability - prev.probability
      );
      foundWasteType = newSorted[0].className;
      wasteType.value = foundWasteType;

      feedbackDiv.textContent = foundWasteType
        ? `Detected waste type: ${foundWasteType}`
        : "Waste type could not be determined";
    };

    // [
    //     {
    //         "className": "PAPER",
    //         "probability": 0.00030855328077450395
    //     },
    //     {
    //         "className": "NYLON",
    //         "probability": 0.028732571750879288
    //     },
    //     {
    //         "className": "RUBBER",
    //         "probability": 0.04151686280965805
    //     },
    //     {
    //         "className": "BOTTLE",
    //         "probability": 0.8093022108078003
    //     },
    //     {
    //         "className": "PLASTIC",
    //         "probability": 0.11970028281211853
    //     },
    //     {
    //         "className": "TINS",
    //         "probability": 0.00043954767170362175
    //     }
    // ]
  });
