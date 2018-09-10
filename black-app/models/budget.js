/*
Budget model contains:
-Cycle Amount
-Remaining Amount
-Reset Date
-Purchase History
*/


var mongoose = require('mongoose');

var budgetSchema = new mongoose.Schema({
    cycle_amount: Number,
    remaining_amount: Number,
    spent_amount: Number,
    reset_date: Date,
    history: [
        {
            description: String,
            amount: Number,
            transaction_date: Date
        }
    ],
    cycle_history: [
        {
            cycle_start_date: Date,
            cycle_end_date: Date,
            total_spent: Number,
            remaining_amount: Number,
            cycle_history: [
                {
                    description: String,
                    amount: Number,
                    transaction_date: Date
                }
            ] 
        }
    ],
    selected: Boolean
});

var Budget = mongoose.model('Budget', budgetSchema);

module.exports = Budget;