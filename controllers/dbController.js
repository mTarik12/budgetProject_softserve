// dbController is a service that implements database interface

const dbController = {
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
}