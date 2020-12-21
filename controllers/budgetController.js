//  budgetController contains all calculation logic in this app
//  also it recalculating data after adding and deleting expense and income items

class Expense {
    constructor(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }
    calcPercentage(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        };
        return this.percentage;
    }
};

const calculateTotal = (budget, type) => {
    let sum = 0;
    budget.allItems[type].forEach((cur) => {
        sum += cur.value;
    });
    budget.totals[type] = sum;
};

const addItem = (budget, type, des, val) => {
    let ID;

    // Create new ID for the item
    if (budget.allItems[type].length > 0) {
        ID = budget.allItems[type][budget.allItems[type].length - 1].id + 1;
    } else {
        ID = 0;
    }
    const newItem = { id: ID, description: des, value: val }
    // Push it into our data structure
    budget.allItems[type].push(newItem);
    // Return the new element
    return { newItem, budget };
};

const calculateBudget = (budget) => {
    // calculate total income and expenses
    calculateTotal(budget, 'exp');
    calculateTotal(budget, 'inc');

    // Calculate the budget: income - expenses
    budget.grossTotal = budget.totals.inc - budget.totals.exp;

    // calculate the percentage of income that we spent
    if (budget.totals.inc > 0) {
        budget.percentage = Math.round((budget.totals.exp / budget.totals.inc) * 100);
    } else {
        budget.percentage = -1;
    }
    return budget;
};

const calculatePercentages = (budget) => {

    budget.allItems.exp.forEach((expense) => {
        const expenseObject = new Expense(expense.id, expense.description, expense.value);
        expense.percentage = expenseObject.calcPercentage(budget.totals.inc);
    });

    return {
        budget,
        percentages: budget.allItems.exp.map((expense) => {
            return expense.percentage;
        })
    }
};

const deleteItem = (budget, type, id) => {

    const ids = budget.allItems[type].map((current) => {
        return current.id;
    });

    const index = ids.indexOf(id);

    if (index !== -1) {
        budget.allItems[type].splice(index, 1);
    };
    return budget;
};

const budgetController = {

    addItem: function (type, description, value) {

        value = parseFloat(parseFloat(value).toFixed(2));

        const initialBudget = dbController.getBudget();

        let { newItem, budget } = addItem(initialBudget, type, description, value);

        // Calculate and update budget
        budget = calculateBudget(budget);

        return { newItem, ...calculatePercentages(budget) };
    },

    deleteItem: function (type, id) {

        const initialBudget = dbController.getBudget();

        let budget = deleteItem(initialBudget, type, id);

        // Calculate and update budget
        budget = calculateBudget(budget);

        return { ...calculatePercentages(budget) };
    },

    getInitialBudget: () => {
        return {
            allItems: {
                exp: [],
                inc: []
            },
            totals: {
                exp: 0,
                inc: 0
            },
            grossTotal: 0,
            percentage: -1,
        };
    },
};