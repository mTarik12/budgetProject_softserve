const DOMstrings = {
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


const formatNumber = (num, type) => {

    num = Math.abs(num);
    num = num.toFixed(2);

    const numSplit = num.split('.');

    let int = numSplit[0];

    if (int.length > 3) {
        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
    }

    const dec = numSplit[1];

    return `${(type === 'exp' ? '-' : '+')} ${int}.${dec}`;
};


const nodeListForEach = (list, callback) => {

    for (let i = 0; i < list.length; i++) {
        callback(list[i], i);
    }
};

const addListItem = (obj, type) => {
    let html, newHtml, element;

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

// UI CONTROLLER

const UIController = {

    getInput: () => {
        return {
            type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
        };
    },


    addListItem,

    displayItemsList: (allItems) => {

        allItems.exp.forEach((expItem) => {
            addListItem(expItem, 'exp');
        });

        allItems.inc.forEach((incItem) => {
            addListItem(incItem, 'inc');
        });
    },


    deleteListItem: (selectorID) => {

        const el = document.getElementById(selectorID);
        el.parentNode.removeChild(el);
    },

    clearFields: () => {
        const fields = document.querySelectorAll(`${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`);

        const fieldsArr = Array.from(fields);

        fieldsArr.forEach((current, index, array) => {
            current.value = "";
        });

        fieldsArr[0].focus();
    },


    displayBudget: (budget) => {
        let type;
        budget.budget > 0 ? type = 'inc' : type = 'exp';

        document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(budget.budget, type);
        document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(budget.totals.inc, 'inc');
        document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(budget.totals.exp, 'exp');

        if (budget.percentage >= 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = `${budget.percentage}%`;
        } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
        }
    },

    displayPercentages: (percentages) => {

        const fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

        nodeListForEach(fields, (current, index) => {

            if (percentages[index] > 0) {
                current.textContent = `${percentages[index]}%`;
            } else {
                current.textContent = '---';
            }
        });
    },

    displayMonth: () => {
        const now = new Date();

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = now.getMonth();

        const year = now.getFullYear();
        document.querySelector(DOMstrings.dateLabel).textContent = `${months[month]} ${year}`;
    },

    changedType: () => {

        const fields = document.querySelectorAll(`${DOMstrings.inputType}, ${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`);

        nodeListForEach(fields, (cur) => {
            cur.classList.toggle('red-focus');
        });

        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

    },

    getDOMstrings: () => {
        return DOMstrings;
    },
};