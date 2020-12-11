var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
};


Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
        this.percentage = -1;
    };
    return this.percentage;
};

var calculateTotal = function (budget, type) {
    var sum = 0;
    budget.allItems[type].forEach(function (cur) {
        sum += cur.value;
    });
    budget.totals[type] = sum;
};


var budgetController = {

    addItem: function (type, des, val) {
        var ID;
        var budget = this.getBudget();

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

        //this.saveBudget(budget);

        // Return the new element
        return { newItem, budget };
    },


    deleteItem: function (type, id) {
        var ids, index;

        // id = 6
        //data.allItems[type][id];
        // ids = [1 2 4  8]
        //index = 3

        var budget = this.getBudget();

        ids = budget.allItems[type].map(function (current) {
            return current.id;
        });

        index = ids.indexOf(id);

        if (index !== -1) {
            budget.allItems[type].splice(index, 1);
        };
        return budget;


    },


    calculateBudget: function (budget) {

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

    calculatePercentages: function (budget) {

        budget.allItems.exp.forEach(function (expense) {
            var expenseObject = new Expense(expense.id, expense.description, expense.value);
            expense.percentage = expenseObject.calcPercentage(budget.totals.inc);
        });
    },


    getPercentages: function (budget) {

        return budget.allItems.exp.map(function (expense) {
            return expense.percentage;
        })
    },


    // TODO get and save to db Controller
    getBudget: function () {
        var budget = localStorage.getItem(BUDGET_LOCAL_STORAGE_KEY);
        console.log(budget);
        if (budget) {
            return JSON.parse(budget);
        } else {
            //throw new Error('No budget on local storage');
            return false;
        };
    },

    saveBudget: function (budget) {
        localStorage.setItem(BUDGET_LOCAL_STORAGE_KEY, JSON.stringify(budget));
    },

    getInitialBudget: function () {
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

// export { budgetController };