// index.js

// Handle navigation between tabs
function navigate(tab) {
    const mainContent = document.getElementById('main-content');

    if (tab === 'home') {
        mainContent.innerHTML = '<h1>Welcome, ' + localStorage.getItem('user') + '</h1>';
        mainContent.innerHTML += '<p>Welcome to your Trading Card Collection!</p>';
        displayCollection();
    } else if (tab === 'collection') {
        mainContent.innerHTML = '<h1>Your Collection</h1>';
        displayCollection();
    } else if (tab === 'decks') {
        mainContent.innerHTML = '<h1>Your Decks</h1>';
        displayDecks();
    } else if (tab === 'storages') {
        mainContent.innerHTML = '<h1>Your Storages</h1>';
        displayStorages();
    }
}

// Display cards in your collection
function displayCollection() {
    const collectionContainer = document.getElementById("main-content");
    collectionContainer.innerHTML += '<h2>Collection</h2>';
    
    let storedCards = JSON.parse(localStorage.getItem('cards')) || [];
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

// Display your deck-building preview
function displayDecks() {
    const decksContainer = document.getElementById("main-content");
    decksContainer.innerHTML += '<h2>Deck Preview</h2>';
    
    let savedDeck = JSON.parse(localStorage.getItem('currentDeck')) || [];
    savedDeck.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card-item");

        const img = document.createElement("img");
        img.src = card.image;

        const categoryLabel = document.createElement("p");
        categoryLabel.textContent = `Category: ${card.category}`;

        decksContainer.appendChild(cardElement);
    });
}

// Handle card removal from collection
function removeCard(cardId) {
    let storedCards = JSON.parse(localStorage.getItem('cards')) || [];
    storedCards = storedCards.filter(card => card.id !== cardId);
    localStorage.setItem('cards', JSON.stringify(storedCards));
    displayCollection();
}

// Log out the user
function logOut() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';  // Redirect to login
}

// Display storages
function displayStorages() {
    const storagesContainer = document.getElementById('main-content');
    storagesContainer.innerHTML += '<h2>Your Storages</h2>';

    let storages = JSON.parse(localStorage.getItem('storages')) || {};
    for (let storageName in storages) {
        const storageDiv = document.createElement("div");
        storageDiv.classList.add("storage-item");
        storageDiv.textContent = `Storage: ${storageName}`;
        
        // View button for storages
        const viewButton = document.createElement("button");
        viewButton.textContent = "View Cards";
        viewButton.onclick = () => displayStorageCards(storageName);
        
        storageDiv.appendChild(viewButton);
        storagesContainer.appendChild(storageDiv);
    }
}

// Display cards inside a specific storage
function displayStorageCards(storageName) {
    const storagesContainer = document.getElementById('main-content');
    storagesContainer.innerHTML = '<h2>Storage: ' + storageName + '</h2>';
    
    let storages = JSON.parse(localStorage.getItem('storages'));
    let storageCards = storages[storageName] || [];

    storageCards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card-item");

        const img = document.createElement("img");
        img.src = card.image;

        const categoryLabel = document.createElement("p");
        categoryLabel.textContent = `Category: ${card.category}`;

        storagesContainer.appendChild(cardElement);
    });
}

// Adding new card (from file input)
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

// Save card to localStorage
function saveCardToStorage(card) {
    let storedCards = JSON.parse(localStorage.getItem('cards')) || [];
    storedCards.push(card);
    localStorage.setItem('cards', JSON.stringify(storedCards));
}

