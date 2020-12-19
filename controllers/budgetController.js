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

const budgetController = {

    addItem: function (type, des, val) {
        let ID;
        let budget = this.getBudget();

        //[1 2 3 4 5], next ID = 6
        //[1 2 4 6 8], next ID = 9
        // ID = last ID + 1

        // Create new ID
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
    },

    deleteItem: function (type, id) {
        // id = 6
        //data.allItems[type][id];
        // ids = [1 2 4  8]
        //index = 3

        let budget = this.getBudget();

        const ids = budget.allItems[type].map((current) => {
            return current.id;
        });

        const index = ids.indexOf(id);

        if (index !== -1) {
            budget.allItems[type].splice(index, 1);
        };
        return budget;
    },

    calculateBudget: (budget) => {

        // calculate total income and expenses
        calculateTotal(budget, 'exp');
        calculateTotal(budget, 'inc');

        // Calculate the budget: income - expenses
        // TODO fix budget.budget -> grossTotal
        budget.budget = budget.totals.inc - budget.totals.exp;

        // calculate the percentage of income that we spent
        if (budget.totals.inc > 0) {
            budget.percentage = Math.round((budget.totals.exp / budget.totals.inc) * 100);
        } else {
            budget.percentage = -1;
        }
        // Expense = 100 and income 300, spent 33.333% = 100/300 = 0.3333 * 100
        return budget;
    },

    calculatePercentages: (budget) => {

        budget.allItems.exp.forEach((expense) => {
            const expenseObject = new Expense(expense.id, expense.description, expense.value);
            expense.percentage = expenseObject.calcPercentage(budget.totals.inc);
        });
    },

    getPercentages: function (budget) {

        return budget.allItems.exp.map((expense) => {
            return expense.percentage;
        })
    },

    // TODO get and save to db Controller
    getBudget: function () {
        let budget = localStorage.getItem(BUDGET_LOCAL_STORAGE_KEY);
        // console.log(budget);
        if (budget) {
            return JSON.parse(budget);
        } else {
            //throw new Error('No budget on local storage');
            return false;
        };
    },

    saveBudget: (budget) => {
        localStorage.setItem(BUDGET_LOCAL_STORAGE_KEY, JSON.stringify(budget));
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
            budget: 0,
            percentage: -1,

        };
    },
};