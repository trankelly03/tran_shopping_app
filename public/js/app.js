import { ListModel } from "./model/ListModel.js";
import { ListView } from "./view/ListView.js";
import { ListController } from "./controller/ListController.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log(" app.js wurde geladen!");

    try {
        const listModel = new ListModel();
        const listView = new ListView();

        console.log("ListModel erstellt:", listModel);
        console.log("ListView erstellt:", listView);

        const listController = new ListController(listModel, listView);

        console.log(" ListController erstellt:", listController);


        if (!listController) {
            console.error("Fehler: ListController wurde nicht erstellt!");
        }


        window.controller = listController;
    } catch (error) {
        console.error(" Fehler beim Initialisieren von ListController:", error);
    }
});
