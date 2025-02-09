// index.js

// Display user's name
window.onload = function() {
    const username = localStorage.getItem('user');
    if (username) {
        document.getElementById('user-name').textContent = username;
        displayCollection();
        displayStorages();
    } else {
        window.location.href = 'login.html';  // Redirect to login if no user is logged in
    }
};

// Log out the user
function logOut() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Save card to localStorage
function saveCardToStorage(card) {
    let storedCards = JSON.parse(localStorage.getItem('cards')) || [];
    storedCards.push(card);
    localStorage.setItem('cards', JSON.stringify(storedCards));
    console.log("Cards in storage:", storedCards);
}

// Display all cards in collection
function displayCollection() {
    const collectionContainer = document.getElementById("collection");
    collectionContainer.innerHTML = '';  // Clear current display

    let storedCards = JSON.parse(localStorage.getItem('cards')) || [];
    console.log("Stored Cards:", storedCards);

    storedCards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card-item");

        const img = document.createElement("img");
        img.src = card.image;

        const categoryLabel = document.createElement("p");
        categoryLabel.textContent = `Category: ${card.category}`;

        const removeButton = document.createElement("span");
        removeButton.classList.add("remove-card");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeCard(card.id);

        cardElement.appendChild(img);
        cardElement.appendChild(categoryLabel);
        cardElement.appendChild(removeButton);

        collectionContainer.appendChild(cardElement);
    });
}

// Add a new card
function addNewCard() {
    const cardImage = document.getElementById("card-image").files[0];
    const cardCategory = document.getElementById("card-category").value;

    if (cardImage && cardCategory) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const card = {
                id: new Date().toISOString(),  // Unique ID based on time
                image: event.target.result,  // Base64-encoded image
                category: cardCategory
            };
            saveCardToStorage(card);
            displayCollection();
        };
        reader.readAsDataURL(cardImage);
    } else {
        alert("Please provide both an image and a category.");
    }
}

// Remove card from storage
function removeCard(cardId) {
    let storedCards = JSON.parse(localStorage.getItem('cards')) || [];
    storedCards = storedCards.filter(card => card.id !== cardId);
    localStorage.setItem('cards', JSON.stringify(storedCards));
    displayCollection();
}

// Create a new storage (folder/collection)
function createStorage(storageName) {
    let storages = JSON.parse(localStorage.getItem('storages')) || {};
    
    if (!storages[storageName]) {
        storages[storageName] = [];  // Empty collection for the new storage
        localStorage.setItem('storages', JSON.stringify(storages));
        alert(`Storage "${storageName}" created!`);
        displayStorages();
    } else {
        alert(`Storage "${storageName}" already exists.`);
    }
}

// Transfer card to a specific storage
function transferCardToStorage(cardId, storageName) {
    let storages = JSON.parse(localStorage.getItem('storages'));
    let card = getCardById(cardId);

    if (storages[storageName]) {
        storages[storageName].push(card);
        localStorage.setItem('storages', JSON.stringify(storages));
        alert(`Card moved to "${storageName}" storage.`);
    } else {
        alert(`Storage "${storageName}" doesn't exist.`);
    }
}

// Get a card by its ID
function getCardById(cardId) {
    let storedCards = JSON.parse(localStorage.getItem('cards')) || [];
    return storedCards.find(card => card.id === cardId);
}

// Display all storages
function displayStorages() {
    const storageContainer = document.getElementById("storages");
    storageContainer.innerHTML = '';  // Clear current display

    let storages = JSON.parse(localStorage.getItem('storages')) || {};
    for (let storageName in storages) {
        const storageDiv = document.createElement("div");
        storageDiv.classList.add("storage-item");
        storageDiv.textContent = `Storage: ${storageName}`;
        
        // Add a button to view the storage
        const viewButton = document.createElement("button");
        viewButton.textContent = "View Cards";
        viewButton.onclick = () => displayStorageCards(storageName);

        storageDiv.appendChild(viewButton);
        storageContainer.appendChild(storageDiv);
    }
}

// Display cards in a specific storage
function displayStorageCards(storageName) {
    const collectionContainer = document.getElementById("collection");
    collectionContainer.innerHTML = '';  // Clear current display

    let storages = JSON.parse(localStorage.getItem('storages'));
    let storageCards = storages[storageName] || [];

    storageCards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card-item");

        const img = document.createElement("img");
        img.src = card.image;

        const categoryLabel = document.createElement("p");
        categoryLabel.textContent = `Category: ${card.category}`;

        const removeButton = document.createElement("span");
        removeButton.classList.add("remove-card");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeCard(card.id);

        cardElement.appendChild(img);
        cardElement.appendChild(categoryLabel);
        cardElement.appendChild(removeButton);

        collectionContainer.appendChild(cardElement);
    });
}
