// app is the starting point of a budget application that initiates budget and configures event listeners

const BUDGET_LOCAL_STORAGE_KEY = "budget";

console.log("Application has started.");

UIController.displayMonth();

let budget = dbController.getBudget(BUDGET_LOCAL_STORAGE_KEY);

// If local storage does not contain budget
if (!budget) {
  localStorage.setItem(
    BUDGET_LOCAL_STORAGE_KEY,
    JSON.stringify(budgetController.getInitialBudget())
  );
  budget = budgetController.getInitialBudget();
}

UIController.displayBudget(budget);

UIController.displayItemsList(budget.allItems);

const setupEventListeners = () => {
  const DOM = UIController.getDOMstrings();

  document
    .querySelector(DOM.inputBtn)
    .addEventListener("click", globalController.ctrlAddItem);

  document.addEventListener("keydown", (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      globalController.ctrlAddItem();
    }
  });

  document
    .querySelector(DOM.container)
    .addEventListener("click", globalController.ctrlDeleteItem);

  document
    .querySelector(DOM.inputType)
    .addEventListener("change", UIController.changedType);
};
setupEventListeners();
