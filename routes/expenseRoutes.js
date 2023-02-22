const Expense = require("../models").Expense;
const User = require("../models").User;

module.exports = function (router) {
  router.get("/expense", (req, res) => {
    Expense.findAll()
      .then(expense => {
        if (!expense) {
          return res.status(422).json({ "message": "There is no Expense", "data": {} });
        }
        res.status(200).json({ "message": "Succes Get Data Expense", "data": expense });
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
      return res.status(422).json({ "message": `User Balance It is not Enough : ${user.balance}` });
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