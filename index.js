// Redirect to login if not logged in
if (!localStorage.getItem('user')) {
    window.location.href = 'login.html';
}

function logOut() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Global categories
const categories = ["Competitors", "Entrances", ...Array.from({ length: 30 }, (_, i) => (i + 1).toString())];

function navigate(tab) {
    const mainContent = document.getElementById('main-content');
    if (tab === 'collection') displayCollection();
    else if (tab === 'decks') displayDecks();
    else mainContent.innerHTML = `<h1>Welcome, ${localStorage.getItem('user')}</h1><p>Manage your trading card collection!</p>`;
}

// Global variable to hold the currently selected category
let currentCategory = null;

// Update the display function to include a category filter
function displayCollection() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h1>Your Collection</h1>
        <input type="file" id="cardImage" accept="image/*">
        <input type="text" id="cardName" placeholder="Enter card name">
        <button onclick="addCard()">Add Card</button>
        <h2>Categories</h2>
        <div id="categories">${categories.map(cat => 
            `<button onclick="filterCategory('${cat}')">${cat}</button>`).join("")}
        </div>
        <ul id="collection" class="draggable-list"></ul>
    `;
    loadCollection();
}

// Category filter function
function filterCategory(category) {
    currentCategory = category;  // Store the selected category
    loadCollection(); // Reload the collection with the filter applied
}

// Load the collection and filter by category if needed
function loadCollection() {
    const user = localStorage.getItem('user');
    let collection = JSON.parse(localStorage.getItem(user + '_collection')) || [];
    
    if (currentCategory) {
        collection = collection.filter(card => card.categories.includes(currentCategory)); // Filter by category
    }

    const collectionList = document.getElementById('collection');
    collectionList.innerHTML = "";

    collection.forEach(card => {
        const cardElement = document.createElement('li');
        cardElement.innerHTML = `
            <img src="${card.image}" width="100"><br>
            <strong>${card.name}</strong>
            <br>
            Categories: ${card.categories.join(", ") || "None"}
            <br>
            <button onclick="assignCategory(${card.id})">Assign Category</button>
            <button onclick="removeCard(${card.id})">Remove</button>
        `;
        collectionList.appendChild(cardElement);
    });
}

// Display Decks with real-time updates
function displayDecks() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <h1>Your Decks</h1>
        <input type="text" id="deckName" placeholder="Enter deck name">
        <button onclick="createDeck()">Create Deck</button>
        <ul id="deckList"></ul>
    `;
    loadDecks();
}

// Create Deck and display it immediately
function createDeck() {
    let user = localStorage.getItem('user');
    let decks = JSON.parse(localStorage.getItem(user + '_decks')) || [];
    let deckName = document.getElementById('deckName').value;

    if (!deckName || decks.find(d => d.name === deckName)) return alert("Invalid or duplicate deck name.");

    decks.push({ name: deckName, cards: [] });
    localStorage.setItem(user + '_decks', JSON.stringify(decks));
    loadDecks(); // Refresh deck list after creating a new deck
}

// Load all decks from localStorage
function loadDecks() {
    let user = localStorage.getItem('user');
    let decks = JSON.parse(localStorage.getItem(user + '_decks')) || [];
    let deckList = document.getElementById('deckList');
    deckList.innerHTML = "";
    
    decks.forEach(deck => {
        let deckItem = document.createElement('li');
        deckItem.innerHTML = `
            <strong>${deck.name}</strong>
            <button onclick="editDeck('${deck.name}')">Edit</button>
            <button onclick="deleteDeck('${deck.name}')">Delete</button>
        `;
        deckList.appendChild(deckItem);
    });
}

// Edit Deck (add cards to the deck)
function editDeck(deckName) {
    let user = localStorage.getItem('user');
    let decks = JSON.parse(localStorage.getItem(user + '_decks')) || [];
    let deck = decks.find(d => d.name === deckName);

    if (!deck) return;

    let cardName = prompt("Enter card name to add:");
    let userCollection = JSON.parse(localStorage.getItem(user + '_collection')) || [];
    let card = userCollection.find(c => c.name === cardName);

    if (!card) return alert("Card not found.");
    
    deck.cards.push(card);
    localStorage.setItem(user + '_decks', JSON.stringify(decks));
}

// Delete a deck
function deleteDeck(deckName) {
    let user = localStorage.getItem('user');
    let decks = JSON.parse(localStorage.getItem(user + '_decks')) || [];
    decks = decks.filter(d => d.name !== deckName);
    localStorage.setItem(user + '_decks', JSON.stringify(decks));
    loadDecks();
}

navigate('home');

function makeListDraggable() {
    const list = document.getElementById('collection');
    const draggables = list.querySelectorAll('li');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragover', dragOver);
        draggable.addEventListener('drop', dropCard);
    });
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function dragOver(e) {
    e.preventDefault();
}

function dropCard(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(draggedId);
    // Logic to move the card in the collection
}

navigate('home');
