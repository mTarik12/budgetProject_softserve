const globalController = {

    ctrlAddItem: () => {

        // 1. Get the field input data
        const input = UIController.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to the budget controller
            let { newItem, budget } = budgetController.addItem(input.type, input.description, input.value);

            // 3. Calculate and update budget
            budgetController.calculateBudget(budget);

            // TODO remove calculatePercentages & getPercentages
            // 4. Calculate and update percentages
            budgetController.calculatePercentages(budget);

            // 5. Read percentages from the budget controller
            const percentages = budgetController.getPercentages(budget);

            // 6. Update the UI with the new percentages
            UIController.displayPercentages(percentages);

            // 7. Display the budget on the UI
            UIController.displayBudget(budget);

            // 8. Add the item to the UI
            UIController.addListItem(newItem, input.type);

            // 9.save budget
            budgetController.saveBudget(budget);
        }
    },


    ctrlDeleteItem: (event) => {
        
        const itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            //inc-1 = 0-1
            const splitID = itemID.split('-');
            const type = splitID[0];
            const ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            const newBudget = budgetController.deleteItem(type, ID);

            // 2. Calculate and update budget
            budgetController.calculateBudget(newBudget);

            // TODO remove calculatePercentages & getPercentages
            // 3. Calculate and update percentages
            budgetController.calculatePercentages(newBudget);

            // 4. Read percentages from the budget controller
            const percentages = budgetController.getPercentages(newBudget);

            // 5. Update the UI with the new percentages
            UIController.displayPercentages(percentages);

            // 6. Display the budget on the UI
            UIController.displayBudget(newBudget);

            // 7. Delete the item from the UI
            UIController.deleteListItem(itemID);

            // 8. Clear the fields
            UIController.clearFields();

            // 9. save new recalculated budget
            budgetController.saveBudget(newBudget);
        }
    }
};