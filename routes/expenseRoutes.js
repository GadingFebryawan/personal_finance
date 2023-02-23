const Expense = require("../models/db").Expense;
const User = require("../models/db").User;

module.exports = function (router) {
  router.get("/expense", (req, res) => {
    Expense.findAll()
      .then(expense => {
        if (expense.length == 0) {
          return res.json({ "message": "There is no Expense", "data": [] });
        }
        res.json({ "message": "Succes Get Data Expense", "data": expense });
      })
      .catch(err => res.json(err));
  });

  router.post("/expense", async (req, res) => {
    //update data user
    const user = await User.findOne({ where: { id: req.body.user_id } });
    if (!user) {
      return res.status(422).json({ "message": `User Not Found, Id : ${req.body.user_id}` });
    }

    user.balance -= req.body.amount;
    if (user.balance < 0) {
      return res.status(202).json({ "message": `User Balance It is not Enough : ${user.balance}` });
    }
    await user.save();

    Expense.create({
      user_id: req.body.user_id,
      description: req.body.description,
      amount: req.body.amount,
      date: req.body.date,
    }).then(data => {
      if (!data) {
        return res.status(422).json({ "message": `Failed Create Expense,User Id : ${req.body.user_id}` });
      }
      res.json({ "message": "Success Insert Expense", "data": data });
    }).catch(err => res.json(err));
  });

  router.put("/expense/user/:user_id/id/:id", async (req, res) => {
    try {
      //update data user
      const user = await User.findOne({ where: { id: req.params.user_id } });
      const expense = await Expense.findOne({ where: { id: req.params.id, user_id: req.params.user_id } });
      if (!user) {
        return res.status(422).json({ "message": `User Not Found, Id : ${req.params.user_id}` });
      }
      if (!expense) {
        return res.status(422).json({ "message": `Expense Not Found, Id : ${req.params.id}` });
      }
      //define amount current expense and new expense
      let currentExpense = expense.amount;
      let newExpense = req.body.amount;

      //update data expense
      expense.description = req.body.description;
      expense.amount = req.body.amount;
      expense.date = req.body.date;
      await expense.save();

      //update user balance if balance is change
      if (currentExpense != newExpense) {
        user.balance = (user.balance + currentExpense) - newExpense;
        if (user.balance < 0) {
          return res.status(202).json({ "message": `User Balance It is not Enough : ${user.balance}` });
        }
        await user.save();
      }

      res.json({ "message": "Success Update Data Expense", "data": expense });
    } catch (error) {
      res.status(500).json(error);
    }
  });

  router.delete("/Expense/user/:user_id/id/:id", async (req, res) => {
    //update data user
    const user = await User.findOne({ where: { id: req.params.user_id } });
    const expense = await Expense.findOne({ where: { id: req.params.id, user_id: req.params.user_id } });
    if (!user) {
      return res.status(422).json({ "message": `User Not Found, Id : ${req.params.user_id}` });
    }
    if (!expense) {
      return res.status(422).json({ "message": `Expense Not Found, User Id : ${req.params.user_id} ,Id : ${req.params.id}` });
    }
    user.balance -= expense.amount;
    await user.save();

    //delete expense
    Expense.destroy({
      where: {
        id: req.params.id,
        user_id: req.params.user_id
      }
    }).then(data => {
      if (!data) {
        return res.status(422).json({ "message": `Failed Delete Expense,User Id : ${req.params.user_id} ,Id : ${req.params.id}` });
      }
      return res.json({ "message": `Success Delete Expense,User Id ${req.params.user_id} ,Id : ${req.params.id}` });
    }).catch(err => res.json(err));
  });
};