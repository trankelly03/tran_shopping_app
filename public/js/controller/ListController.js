import {ListModel} from "../model/ListModel.js";
import {ListView} from "../view/ListView.js";

export class ListController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Events binden
        this.view.bindAddItem(this.handleAddItem.bind(this));
        this.view.bindAddExistingItem(this.handleAddExistingItem.bind(this));
        this.view.bindEditItem(this.handleEditItem.bind(this));
        this.view.bindDeleteItem(this.handleDeleteItem.bind(this));
        this.view.bindAddList(this.handleAddList.bind(this));
        this.view.bindDeleteList(this.handleDeleteList.bind(this));
        this.view.bindAddTag(this.handleAddTag.bind(this));
        this.view.bindFilterByTag(this.handleFilterByTag.bind(this));
        this.view.bindSelectList(this.handleSelectList.bind(this));
        this.view.bindCompleteShopping(this.handleCompleteShopping.bind(this));
        this.view.bindEditListName(this.handleEditListName.bind(this));
        this.view.bindEditTag(this.handleEditTag.bind(this));
        this.view.bindDeleteTag(this.handleDeleteTag.bind(this));
        this.view.bindFilterByTag(this.handleFilterByTag.bind(this));
        this.view.bindUpdateQuantity(this.handleUpdateQuantity.bind(this));
        this.view.bindToggleItemCompletion(this.handleToggleItemCompletion.bind(this));



        // Listen aus dem Model laden und erst dann rendern
        this.model.loadLists().then(() => {
            // Debugging-Logs zum Überprüfen, ob Daten geladen wurden
            console.log(" Model geladen:", this.model);
            console.log(" Geladene Listen:", this.model.lists);
            console.log(" Geladene Artikel:", this.model.items);
            console.log(" Geladene Tags:", this.model.tags);

            // Falls `items` undefined ist, leeres Array setzen
            this.model.items = this.model.items || [];

            this.view.renderLists(this.model.lists);
            this.view.renderTags(this.model.tags || []);
            this.view.renderExistingItems(this.model.items || []);

            const listId = new URLSearchParams(window.location.search).get("id");
            const list = this.model.getListById(listId);

            console.log("🔍 Gefundene Liste:", list);

            if (list) {
                const tagFilterElement = document.getElementById("tag-filter");
                this.view.renderItems(list, this.model.items, this.model.tags);
                this.view.renderListName(list);
            } else {
                console.error(" Fehler: Liste nicht gefunden!");
            }
        });
    }
    handleAddList(name) {
        if (!name || name.trim() === "") {
            alert(" Der Name der Liste darf nicht leer sein!");
            return;
        }

        const newList = this.model.createList(name);  // Hier wird die `createList()`-Methode verwendet
        this.model.saveLists();
        this.view.renderLists(this.model.lists);
    }

    handleEditListName(newName) {
        const listId = new URLSearchParams(window.location.search).get("id");
        console.log("Aktuelle Listen-ID:", listId); // Debugging

        if (!listId) {
            console.error(" Fehler: Kein Listen-ID in der URL gefunden!");
            return;
        }

        const list = this.model.getListById(listId);
        console.log("Gefundene Liste:", list); // Debugging

        if (!list) {
            console.error(" Fehler: Liste nicht gefunden!");
            return;
        }

        list.name = newName;
        this.model.saveLists();
        this.view.renderListName(list);
    }

    handleCompleteShopping() {
        console.log("handleCompleteShopping wurde ausgeführt!");

        const listId = new URLSearchParams(window.location.search).get("id");
        const list = this.model.getListById(listId);

        if (!list) {
            console.error("Fehler: Liste nicht gefunden!");
            return;
        }

        this.model.completeShopping(listId);
        this.model.saveLists();

        // Erfolgsnachricht anzeigen
        const messageBox = document.getElementById("shopping-message");
        if (messageBox) {
            messageBox.textContent = ` Einkauf für Liste "${list.name}" abgeschlossen!`;
            messageBox.style.display = "block";
            setTimeout(() => {
                messageBox.style.display = "none";
            }, 3000);
        }

        // Entferne den Button nach Abschluss des Einkaufs
        const completeShoppingButton = document.getElementById("complete-shopping-btn");
        if (completeShoppingButton) {
            completeShoppingButton.style.display = "none";
        }
    }

    handleAddItem(name, tagNames, photo, description, quantity = 1) {
        const listId = new URLSearchParams(window.location.search).get("id");
        const list = this.model.getListById(listId);

        if (list) {
            const newItem = this.model.createItem(name, tagNames, photo, description, quantity);
            newItem.quantity = quantity;
            this.model.items.push(newItem);
            list.items.push(newItem.id);
            this.model.saveLists();
            this.view.renderItems(list, this.model.items, this.model.tags);
        }
    }

    handleUpdateQuantity(itemId, quantity) {
        const item = this.model.items.find(i => i.id === parseInt(itemId));
        if (item) {
            item.quantity = quantity;
            this.model.saveLists();
            const listId = new URLSearchParams(window.location.search).get("id");
            const list = this.model.getListById(listId);
            this.view.renderItems(list, this.model.items, this.model.tags);
        }
    }

    handleDeleteList(id) {
        if (confirm("Möchtest du diese Liste wirklich löschen?")) {
            this.model.deleteList(id);
            this.model.saveLists();
            alert("Liste wurde gelöscht.");
            window.location.href = "index.html";
        }
    }

    handleAddExistingItem(itemId) {
        const listId = new URLSearchParams(window.location.search).get("id");
        const list = this.model.getListById(listId);

        if (!list) {
            console.error("Fehler: Liste nicht gefunden!");
            return;
        }

        if (!this.model.items.find(i => i.id === parseInt(itemId))) {
            console.error("Fehler: Artikel existiert nicht!");
            return;
        }

        if (!list.items.includes(parseInt(itemId))) {
            list.items.push(parseInt(itemId));
            this.model.saveLists();
            this.view.renderItems(list, this.model.items, this.model.tags);
        } else {
            alert("Dieser Artikel ist bereits in der Liste!");
        }
    }

    handleEditItem(itemId, newName) {
        const item = this.model.items.find(i => i.id === parseInt(itemId));
        if (item) {
            item.name = newName;
            this.model.saveLists();
            const listId = new URLSearchParams(window.location.search).get("id");
            const list = this.model.getListById(listId);
            this.view.renderItems(list, this.model.items, this.model.tags);
        }
    }

    handleDeleteItem(itemId) {
        if (!this.model.deleteItem) {
            console.error("Fehler: `deleteItem` ist in `ListModel.js` nicht definiert.");
            return;
        }

        this.model.deleteItem(itemId);
        this.model.saveLists();

        const listId = new URLSearchParams(window.location.search).get("id");
        const list = this.model.getListById(listId);
        if (list) {
            this.view.renderItems(list, this.model.items, this.model.tags);
        }
    }

    handleToggleItemCompletion(itemId) {
        this.model.toggleItemCompletion(itemId);
        const listId = new URLSearchParams(window.location.search).get("id");
        const list = this.model.getListById(listId);
        this.view.renderItems(list, this.model.items, this.model.tags);
    }

    handleAddTag(tagName) {
        const newTag = this.model.createTag(tagName);

        if (!newTag) {
            alert("Dieser Tag existiert bereits!");
            return;
        }

        this.model.saveLists();
        this.view.renderTags(this.model.tags);


        const messageBox = document.getElementById("tag-message");
        if (messageBox) {
            messageBox.textContent = `Tag "${tagName}" wurde erfolgreich hinzugefügt!`;
            messageBox.style.display = "block";
            setTimeout(() => {
                messageBox.style.display = "none";
            }, 3000); // Versteckt die Nachricht nach 3 Sekunden
        }
    }

    handleEditTag(tagId, newName) {
        this.model.updateTag(tagId, newName);
        this.view.renderTags(this.model.tags);
    }

    handleDeleteTag(tagId) {
        this.model.deleteTag(tagId);
        this.view.renderTags(this.model.tags);
    }


    handleFilterByTag(selectedTag) {
        console.log("🔍 Gewähltes Tag:", selectedTag);

        const listId = new URLSearchParams(window.location.search).get("id");
        const list = this.model.getListById(listId);

        if (!list) {
            console.error(" Fehler: Liste nicht gefunden!");
            return;
        }

        console.log(" Originale Artikel:", this.model.items);

        const getTagName = (tag) => {
            if (typeof tag === "object" && tag.name) return tag.name;
            if (typeof tag === "number") {
                const tagObj = this.model.tags.find(t => t.id === tag);
                return tagObj ? tagObj.name : "Unbekannt";
            }
            return tag;
        };

        const filteredItems = selectedTag === "all"
            ? this.model.items
            : this.model.items.filter(item => {
                console.log("🔍 Überprüfe Artikel:", item.name, "Tags:", item.tags);

                if (!item.tags) return false;

                return item.tags.some(tag => getTagName(tag) === selectedTag);
            });

        console.log("Gefilterte Artikel:", filteredItems);
        this.view.renderItems(list, filteredItems, this.model.tags);
    }

    handleSelectList(id) {
        const list = this.model.getListById(id);
        if (list && list.completed) {
            alert("Diese Liste wurde bereits abgeschlossen und kann nicht mehr bearbeitet werden.");
            return;
        }
        window.location.href = `list.html?id=${id}`;
    }


}

