var BUDGET_LOCAL_STORAGE_KEY = 'budget';

var initial_budget = {
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



// BUDGET CONTROLLER
var budgetController = (function () {

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


    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };


    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };


    var calculateTotal = function (budget, type) {
        var sum = 0;
        budget.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        budget.totals[type] = sum;
    };


    return {
        addItem: function (type, des, val) {
            var newItem, ID;
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

            // Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // Push it into our data structure
            budget.allItems[type].push(newItem);

            //this.saveBudget(budget);

            // Return the new element
            return { newItem: newItem, budget: budget };
        },


        deleteItem: function (type, id) {
            var ids, index;

            // id = 6
            //data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

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
            // var allPerc = budget.allItems.exp.map(function (cur) {
            //     cur = new Expense(cur.id, cur.description, cur.value);
            //     return cur.getPercentage();
            // });
            // return allPerc;


            return budget.allItems.exp.map(function (expense) {
                return expense.percentage;
            })
        },


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

    };

})();




// UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };


    var formatNumber = function (num, type) {
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };


    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    var addListItem = function (obj, type) {
        var html, newHtml, element;
        // Create HTML string with placeholder text

        if (type === 'inc') {
            element = DOMstrings.incomeContainer;

            html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp') {
            element = DOMstrings.expensesContainer;

            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        // Replace the placeholder text with some actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%percentage%', obj.percentage);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

        // Insert the HTML into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },


        addListItem: addListItem,
        //addListItem: function fg(args) { return addListItem(args) },

        displayItemsList: function (allItems) {

            allItems.exp.forEach(function (expItem) {
                addListItem(expItem, 'exp');
            });

            allItems.inc.forEach(function (incItem) {
                addListItem(incItem, 'inc');
            });
        },


        deleteListItem: function (selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },


        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },


        displayBudget: function (budget) {
            var type;
            budget.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(budget.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(budget.totals.inc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(budget.totals.exp, 'exp');

            if (budget.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = budget.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },


        displayPercentages: function (percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function (current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },


        displayMonth: function () {
            var now, months, month, year;

            now = new Date();
            //var christmas = new Date(2016, 11, 25);

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },


        changedType: function () {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);

            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },


        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();




// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };


    var ctrlAddItem = function () {

        // 1. Get the field input data
        var input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            var { newItem, budget } = budgetCtrl.addItem(input.type, input.description, input.value);

            // 5. Calculate and update budget
            budgetCtrl.calculateBudget(budget);

            // TODO remove calculatePercentages & getPercentages
            // 6. Calculate and update percentages
            budgetCtrl.calculatePercentages(budget);

            // 2. Read percentages from the budget controller
            var percentages = budgetCtrl.getPercentages(budget);

            // 3. Update the UI with the new percentages
            UICtrl.displayPercentages(percentages);

            // 3. Display the budget on the UI
            UICtrl.displayBudget(budget);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            budgetCtrl.saveBudget(budget);
        }
    };


    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update percentages
            updatePercentages();
        }
    };


    return {
        init: function () {
            console.log('Application has started.');
            UICtrl.displayMonth();

            var budget = budgetController.getBudget(BUDGET_LOCAL_STORAGE_KEY);

            // local storage does not contain budget
            if (!budget) {
                localStorage.setItem(BUDGET_LOCAL_STORAGE_KEY, JSON.stringify(initial_budget));
                budget = initial_budget;
            };


            UICtrl.displayBudget(budget);
            UICtrl.displayItemsList(budget.allItems);


            setupEventListeners();
        }
    };

})(budgetController, UIController);


controller.init();