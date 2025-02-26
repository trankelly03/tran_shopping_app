class ItemView {
    constructor() {
        this.itemContainer = document.getElementById("item-list");
        this.addItemButton = document.getElementById("add-item-btn");
    }
    renderItems(items) {
        this.itemContainer.innerHTML = "";
        items.forEach(item => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex align-items-center justify-content-between";

            const img = item.photo ? `<img src="${item.photo}" alt="${item.name}" style="width:50px; height:50px; margin-right:10px;">` : "";
            const desc = item.description ? `<p>${item.description}</p>` : "";

            li.innerHTML = `
                <div class="d-flex align-items-center">
                    ${img}
                    <div>
                        <strong>${item.name}</strong> ${desc}
                        <input type="number" class="item-quantity" data-id="${item.id}" value="${item.quantity}" min="1" style="width:50px;">
                    </div>
                </div>
                <button class="btn btn-danger btn-sm delete-item" data-id="${item.id}">🗑️</button>
            `;

            this.itemContainer.appendChild(li);
        });

        document.querySelectorAll(".item-quantity").forEach(input => {
            input.addEventListener("change", (event) => {
                const id = event.target.getAttribute("data-id");
                const quantity = parseInt(event.target.value);
                this.handleUpdateQuantity(id, quantity);
            });
        });
    }

    bindAddItem(handler) {
        this.addItemButton.addEventListener("click", () => {
            const name = prompt("Neuer Artikel:");
            if (name) handler(name, [], "", "", 1);
        });
    }

    bindUpdateQuantity(handler) {
        this.handleUpdateQuantity = handler;
    }

    bindToggleItemCompletion(handler) {
        this.handleToggleItemCompletion = handler;

        if (this.itemContainer) {
            this.itemContainer.addEventListener("change", (event) => {
                if (event.target.classList.contains("item-checkbox")) {
                    const id = event.target.getAttribute("data-id");
                    handler(id);
                }
            });
        } else {
            console.error(" Fehler: `itemContainer` nicht gefunden!");
        }
    }


    bindDeleteItem(handler) {
        this.itemContainer.addEventListener("click", (event) => {
            if (event.target.classList.contains("delete-item")) {
                const id = event.target.getAttribute("data-id");
                handler(id);
            }
        });
    }
}
