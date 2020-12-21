// globalController is central one, which connects budget and ui controllers using their methods
// it gives his two main methods to the app.js

const globalController = {

    ctrlAddItem: () => {

        // Get the field input data
        const input = UIController.getInput();

        // checkInput(input)
        if (!input.description.trim() || isNaN(input.value) || input.value < 0) {
            return alert('Description or value is not valid');
        };

        let { newItem, budget, percentages } = budgetController.addItem(input.type, input.description, input.value);

        UIController.displayBudget(budget);

        UIController.addListItem(newItem, input.type);

        UIController.clearFields();

        dbController.saveBudget(budget);

    },

    ctrlDeleteItem: (event) => {

        const itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            //inc-1 = 0-1
            const splitID = itemID.split('-');
            const type = splitID[0];
            const ID = parseInt(splitID[1]);

            const { budget, percentages } = budgetController.deleteItem(type, ID);

            // Update the UI with the new percentages
            UIController.displayPercentages(percentages);

            UIController.displayBudget(budget);

            UIController.deleteListItem(itemID);

            UIController.clearFields();

            dbController.saveBudget(budget);
        }
    }
};