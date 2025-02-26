class ItemController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.bindAddItem(this.handleAddItem.bind(this));
        this.view.bindDeleteItem(this.handleDeleteItem.bind(this));
        this.view.bindUpdateQuantity(this.handleUpdateQuantity.bind(this));

        this.model.loadItems().then(() => this.view.renderItems(this.model.items));
    }

    handleAddItem(name, tags, photo, description, quantity) {
        const newItem = this.model.createItem(name, tags, photo, description, quantity);
        this.view.renderItems(this.model.items);
    }

    handleUpdateQuantity(id, quantity) {
        this.model.updateItemQuantity(id, quantity);
        this.view.renderItems(this.model.items);
    }

    handleDeleteItem(id) {
        this.model.deleteItem(id);
        this.view.renderItems(this.model.items);
    }
}
