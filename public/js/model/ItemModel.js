class ItemModel {
    constructor() {
        this.items = [];
    }

    async loadItems() {
        const response = await fetch("../data/initial-data.json");
        const data = await response.json();
        this.items = data.items;
    }

    createItem(name, tags, photo = "", description = "", quantity = 1) {
        const newItem = {
            id: Date.now(),
            name,
            tags,
            photo,
            description,
            quantity
        };

        this.items.push(newItem);
        return newItem;
    }

    updateItemQuantity(id, quantity) {
        const item = this.items.find(item => item.id === parseInt(id));
        if (item) {
            item.quantity = quantity;
        }
    }

    deleteItem(id) {
        this.items = this.items.filter(item => item.id !== id);
    }

    toggleItemCompletion(id) {
        const item = this.items.find(item => item.id === parseInt(id));
        if (item) {
            item.completed = !item.completed; // 🔹 Status umschalten
        }
        }
}
