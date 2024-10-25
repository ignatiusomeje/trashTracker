import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

// Firebase configuration
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

// Reference to the location input and suggestions list
const locationInput = document.getElementById("location-name");
const suggestionsList = document.getElementById("location-suggestions");

// Initialize the geocoder for location suggestions
const geocoder = L.Control.Geocoder.nominatim();

// Handle typing in the location input field
locationInput.addEventListener("input", function () {
    const query = locationInput.value;

    if (query.length > 2) {
        geocoder.geocode(query, function (results) {
            suggestionsList.innerHTML = ""; // Clear previous suggestions

            results.forEach(function (result) {
                const li = document.createElement("li");
                li.textContent = result.name; // Display location name

                // Store lat/lng when a suggestion is selected
                li.addEventListener("click", function () {
                    document.getElementById("latitude").value = result.center.lat;
                    document.getElementById("longitude").value = result.center.lng;

                    locationInput.value = result.name; // Set the selected location
                    suggestionsList.innerHTML = ""; // Clear the suggestion list
                });

                suggestionsList.appendChild(li);
            });
        });
    }
});

// Handle form submission
document.getElementById("submit-button").addEventListener("click", function () {
    const name = document.getElementById("location-name").value;
    const address = document.getElementById("address").value;
    const wasteType = document.getElementById("waste-type").value; // Get the selected waste type
    const description = document.getElementById("description").value;
    const imageFile = document.getElementById("image-upload").files[0];
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    // Log wasteType to check if it's being selected correctly
    console.log("Waste Type selected: ", wasteType);

    if (name && wasteType && address && description && imageFile && latitude && longitude) {
        uploadData(name, address, wasteType, description, imageFile, latitude, longitude);
    } else {
        alert("Please fill in all fields and select a location.");
    }
});

// Upload data to Firebase Firestore
function uploadData(name, address, wasteType, description, imageFile, latitude, longitude) {
    const storageRef = ref(storage, 'images/' + imageFile.name);

    uploadBytes(storageRef, imageFile).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
            addDoc(collection(db, "dumpingSites"), {
                name: name,
                address: address,
                wasteType: wasteType, // Store the selected waste type
                description: description,
                imageUrl: downloadURL,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            })
            .then(() => {
                alert("Location submitted successfully!");
                window.location.href = 'index.html'; // Redirect to home page
            })
            .catch((error) => {
                console.error("Error storing location:", error);
                alert("An error occurred while storing the location.");
            });
        });
    });
}
