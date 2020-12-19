const globalController = {

    ctrlAddItem: () => {

        // 1. Get the field input data
        const input = UIController.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            let { newItem, budget, percentages } =
                budgetController.addItem(input.type, input.description, input.value);


            // 6. Update the UI with the new percentages
            UIController.displayPercentages(percentages);

            // 7. Display the budget on the UI
            UIController.displayBudget(budget);

            // 8. Add the item to the UI
            UIController.addListItem(newItem, input.type);

            // 9.save budget
            dbController.saveBudget(budget);
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
            const {budget,percentages} = budgetController.deleteItem(type, ID);

            // 5. Update the UI with the new percentages
            UIController.displayPercentages(percentages);

            // 6. Display the budget on the UI
            UIController.displayBudget(budget);

            // 7. Delete the item from the UI
            UIController.deleteListItem(itemID);

            // 8. Clear the fields
            UIController.clearFields();

            // 9. save new recalculated budget
            dbController.saveBudget(budget);
        }
    }
};