// import { budgetController } from './budgetController';
// import { UIController } from './uiController';

var globalController = {

    ctrlAddItem: function () {

        // 1. Get the field input data
        var input = UIController.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            var { newItem, budget } = budgetController.addItem(input.type, input.description, input.value);

            // 5. Calculate and update budget
            budgetController.calculateBudget(budget);

            // TODO remove calculatePercentages & getPercentages
            // 6. Calculate and update percentages
            budgetController.calculatePercentages(budget);

            // 2. Read percentages from the budget controller
            var percentages = budgetController.getPercentages(budget);

            // 3. Update the UI with the new percentages
            UIController.displayPercentages(percentages);

            // 3. Display the budget on the UI
            UIController.displayBudget(budget);

            // 3. Add the item to the UI
            UIController.addListItem(newItem, input.type);

            // saved budget
            budgetController.saveBudget(budget);
        }
    },


    ctrlDeleteItem: function (event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            const newBudget = budgetController.deleteItem(type, ID);

            // 5. Calculate and update budget
            budgetController.calculateBudget(newBudget);

            // TODO remove calculatePercentages & getPercentages
            // 6. Calculate and update percentages
            budgetController.calculatePercentages(newBudget);

            // 2. Read percentages from the budget controller
            var percentages = budgetController.getPercentages(newBudget);

            // 3. Update the UI with the new percentages
            UIController.displayPercentages(percentages);

            // 3. Display the budget on the UI
            UIController.displayBudget(newBudget);

            // 2. Delete the item from the UI
            UIController.deleteListItem(itemID);

            // 4. Clear the fields
            UIController.clearFields();

            budgetController.saveBudget(newBudget);
        }

    }
}

// export { globalController };