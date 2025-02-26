export class ListModel {
    constructor() {
        this.lists = [];
        this.items = [];  // Falls nicht vorhanden, sicherstellen
        this.tags = [];
    }

    async loadLists() {
        try {
            const response = await fetch("data/initial-data.json");
            if (!response.ok) {
                throw new Error(`Fehler beim Laden der JSON-Datei: ${response.statusText}`);
            }
            const data = await response.json();

            this.lists = JSON.parse(localStorage.getItem("lists")) || data.lists || [];
            this.items = JSON.parse(localStorage.getItem("items")) || data.items || [];
            this.tags = JSON.parse(localStorage.getItem("tags")) || data.tags || [];

            console.log("Listen geladen:", this.lists);
            console.log("Artikel geladen:", this.items);
            console.log(" Tags geladen:", this.tags);
        } catch (error) {
            console.error("Fehler beim Laden der Listen:", error);
        }
    }

    createList(name) {
        const newList = {
            id: Date.now(),  // Eindeutige ID basierend auf Zeitstempel
            name: name,
            items: [],
            completed: false  // Hinzufügen, falls Listen als abgeschlossen markiert werden sollen
        };

        this.lists.push(newList);
        this.saveLists();  // Speichert die Listen im lokalen Speicher oder JSON
        return newList;
    }

    updateListName(listId, newName) {
        const list = this.getListById(listId);
        if (!list) {
            console.error(`Fehler: Liste mit ID ${listId} nicht gefunden.`);
            return;
        }

        list.name = newName;
        this.saveLists();
    }

    createItem(name, tagNames, photo = "", description = "") {
        const tagObjects = tagNames.map(tagName => this.getOrCreateTag(tagName));

        const newItem = {
            id: Date.now(),
            name,
            tags: tagObjects.map(tag => tag.name), // Nur Namen speichern
            photo,  // Neues Feld für das Bild
            description // Neues Feld für die Beschreibung
        };

        this.items.push(newItem);
        this.saveLists();
        return newItem;
    }

    updateItemQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === parseInt(itemId));
        if (item) {
            item.quantity = quantity;
            this.saveLists();
        }
    }

    getOrCreateTag(name) {
        let tag = this.tags.find(t => t.name.toLowerCase() === name.toLowerCase());
        if (!tag) {
            tag = { id: Date.now(), name };
            this.tags.push(tag);
            this.saveLists();
        }
        return tag; // **Hier das ganze Tag-Objekt zurückgeben**
    }

    loadTags() {
        return fetch('initial-data.json')
            .then(response => response.json())
            .then(data => {
                this.tags = data.tags || []; // Falls keine Tags existieren, leeres Array setzen
            })
            .catch(error => console.error("Fehler beim Laden der Tags:", error));
    }

    createTag(name) {
        const existingTag = this.tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
        if (!existingTag) {
            const newTag = { id: Date.now(), name };
            this.tags.push(newTag);
            this.saveLists();
            return newTag;
        }
        return existingTag;
    }

    updateTag(tagId, newName) {
        const tag = this.tags.find(t => t.id === parseInt(tagId));
        if (tag) {
            tag.name = newName;
            this.saveLists();
        } else {
            console.error("Tag nicht gefunden!");
        }
    }

    deleteTag(tagId) {
        if (confirm("Möchtest du diesen Tag wirklich löschen?")) {
            this.tags = this.tags.filter(tag => tag.id !== parseInt(tagId));
            this.items.forEach(item => {
                item.tags = item.tags.filter(tagName => tagName !== tagId);
            });
            this.saveLists();
        }
    }

    deleteList(id) {
        this.lists = this.lists.filter(list => list.id !== parseInt(id));
        this.saveLists(); // Funktioniert jetzt!
    }
    deleteItem(itemId) {
        this.items = this.items.filter(item => item.id !== parseInt(itemId));

        // Entferne das Item aus allen Listen
        this.lists.forEach(list => {
            list.items = list.items.filter(id => id !== parseInt(itemId));
        });

        this.saveLists();
    }

    toggleItemCompletion(itemId) {
        const item = this.items.find(item => item.id === parseInt(itemId));
        if (item) {
            item.completed = !item.completed; // Status wechseln
            this.saveLists(); // Änderungen speichern
        }
    }

    saveLists() {
        localStorage.setItem("lists", JSON.stringify(this.lists));
        localStorage.setItem("items", JSON.stringify(this.items));
        localStorage.setItem("tags", JSON.stringify(this.tags));
        localStorage.setItem("shoppingLists", JSON.stringify(this.lists));

    }

    getListById(id) {
        if (!id) return undefined;
        return this.lists.find(list => list.id.toString() === id.toString());
    }


    completeShopping(listId) {
        console.log(`completeShopping für Liste ${listId} wurde aufgerufen!`);

        const list = this.getListById(listId);
        if (!list) {
            console.error(`Fehler: Liste mit ID ${listId} nicht gefunden.`);
            return;
        }

        list.completed = true;
        this.saveLists();
    }
}


