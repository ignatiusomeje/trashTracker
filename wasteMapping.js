// wasteMapping.js

// Mapping for COCO-SSD predictions to specific waste categories
const wasteMapping = {
    plastic: "Plastic",
    bottle: "Plastic",
    cup: "Plastic",
    bag: "Plastic",
    "plastic bag": "Plastic",

    paper: "Paper",
    book: "Paper",
    "paper towel": "Paper",
    newspaper: "Paper",

    glass: "Glass",
    "wine glass": "Glass",
    bottle: "Glass",
    jar: "Glass",
    "glass bottle": "Glass",

    metal: "Metal",
    can: "Metal",
    "tin can": "Metal",
    "metal container": "Metal",

    organic: "Organic",
    food: "Organic",
    fruit: "Organic",
    vegetable: "Organic",
    plant: "Organic",
    "food waste": "Organic",

    "industrial waste": "Industrial Waste",
    machinery: "Industrial Waste",
    equipment: "Industrial Waste",
    "scrap metal": "Industrial Waste",

    hazardous: "Hazardous",
    "chemical bottle": "Hazardous",
    battery: "Hazardous",
    "paint can": "Hazardous",
    "toxic material": "Hazardous",

    "e-waste": "E-Waste",
    electronics: "E-Waste",
    computer: "E-Waste",
    phone: "E-Waste",
    "electronic waste": "E-Waste"
};

// Function to classify the waste type based on COCO-SSD prediction
export function classifyWasteType(predictionClass) {
    return wasteMapping[predictionClass.toLowerCase()] || "";
}
