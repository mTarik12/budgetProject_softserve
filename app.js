var BUDGET_LOCAL_STORAGE_KEY = 'budget';

console.log('Application has started.');
UIController.displayMonth();

var budget = budgetController.getBudget(BUDGET_LOCAL_STORAGE_KEY);

// local storage does not contain budget
if (!budget) {
    localStorage.setItem(BUDGET_LOCAL_STORAGE_KEY, JSON.stringify(budgetController.getInitialBudget()));
    budget = budgetController.getInitialBudget();
};


UIController.displayBudget(budget);
UIController.displayItemsList(budget.allItems);


setupEventListeners();


function setupEventListeners() {
    var DOM = UIController.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', globalController.ctrlAddItem);

    document.addEventListener('keypress', function (event) {
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
        }
    });

    document.querySelector(DOM.container).addEventListener('click', globalController.ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UIController.changedType);
};