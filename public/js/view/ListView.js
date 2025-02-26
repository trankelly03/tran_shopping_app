export class ListView {
    constructor() {
        this.listContainer = document.getElementById("list-overview");
        this.addListButton = document.getElementById("new-list-btn");
        this.deleteListButton = document.getElementById("delete-list-btn");

        if (window.location.pathname.includes("list.html")) {
            this.itemContainer = document.getElementById("item-list");
            this.addItemButton = document.getElementById("add-item-btn");
            this.addExistingItemButton = document.getElementById("add-existing-item-btn");
            this.tagFilter = document.getElementById("tag-filter");
            this.existingItemSelect = document.getElementById("existing-item-select");
            this.addTagButton = document.getElementById("add-tag-btn");
            this.newTagName = document.getElementById("new-tag-name");

            if (!this.deleteListButton) console.error("Fehler: `delete-list-btn` nicht gefunden!");
        }
    }
    bindCompleteShopping(handler) {
        console.log("bindCompleteShopping wird aufgerufen!");

        const completeShoppingButton = document.getElementById("complete-shopping-btn");
        if (completeShoppingButton) {
            console.log("Button gefunden! Event wird gebunden...");

            completeShoppingButton.addEventListener("click", () => {
                console.log("Einkauf abschließen wurde geklickt!");
                if (confirm("Möchtest du diesen Einkauf wirklich abschließen?")) {
                    handler();
                }
            });
        } else {
            console.error("Fehler: `complete-shopping-btn` nicht gefunden!");
        }
    }
    bindToggleItemCompletion(handler) {
        if (!this.itemContainer) {
            console.error(" Fehler: `itemContainer` nicht gefunden!");
            return;
        }

        this.itemContainer.addEventListener("change", (event) => {
            if (event.target.classList.contains("item-checkbox")) {
                const id = event.target.getAttribute("data-id");
                handler(id);
            }
        });
    }

    bindAddList(handler) {
        if (this.addListButton) {
            this.addListButton.addEventListener("click", () => {
                const name = prompt("Gib den Namen der neuen Liste ein:");
                if (name) handler(name);
            });
        } else {
            console.error(" Fehler: `new-list-btn` nicht gefunden!");
        }
    }
    bindDeleteList(handler) {
        if (this.deleteListButton) {
            this.deleteListButton.addEventListener("click", () => {
                if (confirm("Möchtest du diese Liste wirklich löschen?")) {
                    const listId = new URLSearchParams(window.location.search).get("id");
                    handler(listId);
                }
            });
        } else {
            console.error("Fehler: `deleteListButton` nicht gefunden!");
        }
    }

    bindSelectList(handler) {
        this.handleSelectList = handler;
    }

    bindAddTag(handler) {
        if (this.addTagButton) {
            this.addTagButton.addEventListener("click", () => {
                const tagName = this.newTagName.value.trim();
                if (tagName) {
                    handler(tagName);
                    this.newTagName.value = "";
                }
            });
        }
    }

    bindFilterByTag(handler) {
        this.handleFilterByTag = handler;

        if (this.tagFilter) {
            this.tagFilter.addEventListener("change", () => {
                const selectedTag = this.tagFilter.value;
                console.log("Tag-Filter geändert:", selectedTag);

                if (typeof this.handleFilterByTag === "function") {
                    this.handleFilterByTag(selectedTag);
                } else {
                    console.error(" Fehler: `handleFilterByTag` wurde nicht richtig gebunden!");
                }
            });
        } else {
            console.error(" Fehler: `tagFilter` nicht gefunden!");
        }
    }

    bindEditListName(handler) {
        const editButton = document.getElementById("edit-list-name-btn");
        if (editButton) {
            editButton.addEventListener("click", () => {
                const newName = prompt("Neuer Name für die Liste:");
                if (newName) {
                    handler(newName);
                }
            });
        } else {
            console.error("Fehler: `edit-list-name-btn` nicht gefunden!");
        }
    }
    renderLists(lists) {
        if (!this.listContainer) return;
        this.listContainer.innerHTML = "";

        lists.forEach(list => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";


            if (list.completed) {
                li.style.backgroundColor = "#d3d3d3"; // Grau für abgeschlossene Listen
                li.innerHTML = `<strong>${list.name}</strong> (${list.items.length} Artikel) <span class="badge bg-success">✅ Abgeschlossen</span>`;
            } else {
                li.innerHTML = `<strong>${list.name}</strong> (${list.items.length} Artikel)`;
            }

            li.style.cursor = list.completed ? "default" : "pointer";

            if (!list.completed) {
                li.addEventListener("click", () => this.handleSelectList(list.id));
            }

            this.listContainer.appendChild(li);
        });
    }

    renderTags(tags) {
        const tagList = document.getElementById("tag-list");
        const tagFilter = document.getElementById("tag-filter");
        if (!tagList || !tagFilter) return;

        tagList.innerHTML = "";
        tagFilter.innerHTML = `<option value="all">Alle</option>`;

        tags.forEach(tag => {
            const tagName = typeof tag === "object" ? tag.name : tag;
            const tagId = typeof tag === "object" ? tag.id : Date.now();

            // Tag-Liste (Bearbeiten & Löschen)
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
            <span>${tagName}</span>
            <div>
                <button class="btn btn-warning btn-sm edit-tag" data-id="${tagId}">✏️ Bearbeiten</button>
                <button class="btn btn-danger btn-sm delete-tag" data-id="${tagId}">🗑️ Löschen</button>
            </div>
        `;
            tagList.appendChild(li);


            const option = document.createElement("option");
            option.value = tagName;
            option.textContent = tagName;
            tagFilter.appendChild(option);
        });

        // Event-Listener für Bearbeiten
        document.querySelectorAll(".edit-tag").forEach(button => {
            button.addEventListener("click", (event) => {
                const tagId = event.target.getAttribute("data-id");
                const newName = prompt("Neuer Tag-Name:");
                if (newName) {
                    this.handleEditTag(tagId, newName);
                }
            });
        });

        // Event-Listener für Löschen
        document.querySelectorAll(".delete-tag").forEach(button => {
            button.addEventListener("click", (event) => {
                const tagId = event.target.getAttribute("data-id");
                this.handleDeleteTag(tagId);
            });
        });

        //  Sicherstellen, dass die Filterfunktion weiterhin funktioniert
        tagFilter.addEventListener("change", () => {
            const selectedTag = tagFilter.value;
            console.log(" Tag-Filter geändert:", selectedTag);
            this.handleFilterByTag(selectedTag);
        });
    }

    bindEditTag(handler) {
        this.handleEditTag = handler;
    }

    bindDeleteTag(handler) {
        this.handleDeleteTag = handler;
    }

    renderItems(list, items, tags, selectedTag = "all") {
        if (!this.itemContainer) return;
        this.itemContainer.innerHTML = "";

        console.log("Starte Rendern mit Tag:", selectedTag);
        console.log(" Alle Artikel:", items);
        console.log(" Alle Tags:", tags);


        const getTagName = (tag) => {
            if (typeof tag === "object" && tag.name) return tag.name;
            if (typeof tag === "number") {
                const tagObj = tags.find(t => t.id === tag);
                return tagObj ? tagObj.name : "Unbekannt";
            }
            return tag;
        };

        const filteredItems = selectedTag === "all"
            ? list.items.map(itemId => items.find(i => i.id === itemId)).filter(i => i)
            : list.items.map(itemId => {
                const item = items.find(i => i.id === itemId);
                if (!item) return null;


                const hasTag = item.tags && item.tags.some(tag => getTagName(tag) === selectedTag);
                return hasTag ? item : null;
            }).filter(i => i);

        console.log(" Endgültig gefilterte Artikel:", filteredItems);


        if (filteredItems.length === 0) {
            this.itemContainer.innerHTML = `<li class="list-group-item text-muted">⚠ Keine Artikel gefunden</li>`;
            return;
        }


        filteredItems.forEach(item => {
            const tagNames = (Array.isArray(item.tags) ? item.tags : []).map(tag => getTagName(tag));

            const img = item.photo ? `<img src="${item.photo}" alt="${item.name}" style="width:50px; height:50px; margin-right:10px;">` : "";
            const desc = item.description ? `<p>${item.description}</p>` : "";


            let quantity = item.quantity !== undefined ? item.quantity : 1;


            const listItem = list.items.find(i => i.id === item.id);
            if (listItem && listItem.quantity !== undefined) {
                quantity = listItem.quantity;
            }


            const checked = item.completed ? "checked" : "";
            const textDecoration = item.completed ? "text-decoration: line-through; opacity: 0.6;" : "";

            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `
        <div>
            <input type="checkbox" class="item-checkbox me-2" data-id="${item.id}" ${checked}>
            ${img}
            <span style="${textDecoration}"><strong>${item.name}</strong> <small>(${tagNames.join(", ")})</small></span>
            ${desc}
            <div class="mt-2">
                <label for="quantity-${item.id}">Menge:</label>
                <input type="number" id="quantity-${item.id}" class="item-quantity form-control d-inline-block w-25" data-id="${item.id}" value="${quantity}" min="1">
            </div>
        </div>
        <div>
            <button class="btn btn-warning btn-sm edit-item" data-id="${item.id}">✏️ Bearbeiten</button>
            <button class="btn btn-danger btn-sm delete-item" data-id="${item.id}">🗑️ Löschen</button>
        </div>
        `;

            this.itemContainer.appendChild(li);
        });


        document.querySelectorAll(".item-quantity").forEach(input => {
            input.addEventListener("change", (event) => {
                const id = event.target.getAttribute("data-id");
                const quantity = parseInt(event.target.value);

                console.log(`🔄 Menge geändert: Artikel-ID ${id}, neue Menge: ${quantity}`);


                this.handleUpdateQuantity(id, quantity);
            });
        });


        document.querySelectorAll(".item-checkbox").forEach(checkbox => {
            checkbox.addEventListener("change", (event) => {
                const id = event.target.getAttribute("data-id");

                console.log(`✔️ Artikel-Status geändert: Artikel-ID ${id}`);

                // Status speichern
                this.handleToggleItemCompletion(id);
            });
        });

        console.log("Alle Artikel wurden erfolgreich gerendert!");
    }


    renderListName(list) {
        const listNameElement = document.getElementById("list-name");
        if (!listNameElement) return;

        if (!list) {
            console.error(" Fehler: Liste ist undefined in renderListName!");
            listNameElement.innerHTML = "<h2 style='color: red;'>⚠ Fehler: Liste nicht gefunden</h2>";
            return;
        }

        listNameElement.textContent = list.name; // Listen-Namen setzen
    }

    renderExistingItems(items) {
        if (!this.existingItemSelect) return;
        this.existingItemSelect.innerHTML = `<option value="">Artikel auswählen...</option>`;

        if (!Array.isArray(items) || items.length === 0) {
            console.warn("Es gibt keine vorhandenen Artikel.");
            return;
        }

        items.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            option.textContent = item.name;
            this.existingItemSelect.appendChild(option);
        });
    }

    bindAddItem(handler) {
        if (this.addItemButton) {
            this.addItemButton.addEventListener("click", () => {
                const name = prompt("Neuer Artikelname:");
                const tagInput = prompt("Tags durch Komma trennen (z.B. Obst, Gemüse):");
                const photo = prompt("Bild-URL (optional):");
                const description = prompt("Beschreibung (optional):");
                const quantity = parseInt(prompt("Menge eingeben:", "1"));

                if (name && tagInput) {
                    const tagNames = tagInput.split(",").map(tag => tag.trim());
                    handler(name, tagNames, photo, description, quantity);
                }
            });
        }
    }

    bindUpdateQuantity(handler) {
        if (this.itemContainer) {
            this.itemContainer.addEventListener("change", (event) => {
                if (event.target.classList.contains("item-quantity")) {
                    const itemId = event.target.getAttribute("data-id");
                    const quantity = parseInt(event.target.value);
                    handler(itemId, quantity);
                }
            });
        } else {
            console.error("Fehler: `itemContainer` nicht gefunden!");
        }
    }

    bindAddExistingItem(handler) {
        if (this.addExistingItemButton) {
            this.addExistingItemButton.addEventListener("click", () => {
                const itemId = this.existingItemSelect.value;
                if (itemId) {
                    handler(parseInt(itemId));
                } else {
                    alert("Bitte wähle einen Artikel aus der Liste!");
                }
            });
        } else {
            console.error("Fehler: `addExistingItemButton` nicht gefunden!");
        }
    }

    bindEditItem(handler) {
        if (this.itemContainer) {
            this.itemContainer.addEventListener("click", (event) => {
                if (event.target.classList.contains("edit-item")) {
                    const itemId = event.target.getAttribute("data-id");
                    const newName = prompt("Neuen Namen für den Artikel eingeben:");
                    if (newName) {
                        handler(itemId, newName);
                    }
                }
            });
        } else {
            console.error("Fehler: `itemContainer` nicht gefunden!");
        }
    }

    bindDeleteItem(handler) {
        if (this.itemContainer) {
            this.itemContainer.addEventListener("click", (event) => {
                if (event.target.classList.contains("delete-item")) {
                    const itemId = event.target.getAttribute("data-id");
                    if (confirm("Möchtest du diesen Artikel wirklich löschen?")) {
                        handler(parseInt(itemId));
                    }
                }
            });
        }
    }

}



