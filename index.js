// 1. Check if the user is logged in
if (!localStorage.getItem('user')) {
    window.location.href = 'login.html';  // Redirect to login if not logged in
}

// 2. Function to log out the user
function logOut() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';  // Redirect to login after logout
}

// 3. Function to handle navigation between tabs
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

// 4. Function to display the collection of cards
function displayCollection() {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert("You must be logged in to view your collection.");
        return;
    }

    let collection = JSON.parse(localStorage.getItem(user + '_collection')) || [];

    const collectionContainer = document.getElementById('main-content');
    collectionContainer.innerHTML = '<h1>Your Collection</h1>';

    // Add a button to add new cards
    collectionContainer.innerHTML += '<button onclick="addCard()">Add New Card</button>';

    collection.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.textContent = `Card ID: ${card.id}, Name: ${card.name}, Category: ${card.category}`;

        // Add a remove button to each card
        const removeButton = document.createElement('button');
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeCard(card.id);
        cardElement.appendChild(removeButton);

        collectionContainer.appendChild(cardElement);
    });
}

// 5. Function to add a new card
function addCard() {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert("You must be logged in to add cards.");
        return;
    }

    const newCard = { 
        id: Date.now(),  // Use the current timestamp as a unique ID
        name: prompt("Enter the name of the card:"), 
        category: prompt("Enter the category of the card:") 
    };

    let collection = JSON.parse(localStorage.getItem(user + '_collection')) || [];
    collection.push(newCard);
    localStorage.setItem(user + '_collection', JSON.stringify(collection));

    displayCollection();  // Refresh the collection display
}

// 6. Function to remove a card
function removeCard(cardId) {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert("You must be logged in to remove cards.");
        return;
    }

    let collection = JSON.parse(localStorage.getItem(user + '_collection')) || [];
    collection = collection.filter(card => card.id !== cardId);  // Remove card with matching ID
    localStorage.setItem(user + '_collection', JSON.stringify(collection));

    displayCollection();  // Refresh the collection display
}

// 7. Function to display the user's decks (for demonstration purposes, can be customized)
function displayDecks() {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert("You must be logged in to view your decks.");
        return;
    }

    let decks = JSON.parse(localStorage.getItem(user + '_decks')) || [];

    const decksContainer = document.getElementById('main-content');
    decksContainer.innerHTML = '<h1>Your Decks</h1>';

    decks.forEach(deck => {
        const deckElement = document.createElement('div');
        deckElement.textContent = `Deck Name: ${deck.name}`;
        decksContainer.appendChild(deckElement);
    });
}

// 8. Function to display the user's storages (for demonstration purposes, can be customized)
function displayStorages() {
    const user = localStorage.getItem('user');
    
    if (!user) {
        alert("You must be logged in to view your storages.");
        return;
    }

    let storages = JSON.parse(localStorage.getItem(user + '_storages')) || [];

    const storagesContainer = document.getElementById('main-content');
    storagesContainer.innerHTML = '<h1>Your Storages</h1>';

    storages.forEach(storage => {
        const storageElement = document.createElement('div');
        storageElement.textContent = `Storage Name: ${storage.name}`;
        storagesContainer.appendChild(storageElement);
    });
}

// Initialize the page to load the collection view by default
navigate('collection');
