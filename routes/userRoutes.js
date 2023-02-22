const User = require("../models").User;
const Income = require("../models").Income;
const Expense = require("../models").Expense;

module.exports = function (router) {
  router.get("/user", (req, res) => {
    User.findAll({
      include: [Income, Expense]
    })
      .then(users => {
        if(!users){
          return res.status(422).json({ "message": "There is no User", "data" : {}});
        }
        res.json({ "message": "Success Get All User", "data": users });
      })
      .catch(err => res.json(err));
  });

  router.get("/user/:id", (req, res) => {
    User.findAll({
      where: { id: req.params.id },
      include: [Income,Expense]
    })
      .then(user => {
        if(!user[0]){
          return res.status(422).json({ "message": `User Not Found, Id : ${req.params.id}`});
        }
        res.json({ "message": `Success Get Data User, Id : ${req.params.id}`, "data": user[0] });
      })
      .catch(err => res.json(err));
  });

  router.post("/user", (req, res) => {
    User.create({
      name: req.body.name,
      birth: req.body.birth,
      balance: req.body.balance,
      default_balance: req.body.default_balance,
    }).then(data => {
      res.json({ "message": "Success Create User", "data": data });
    }).catch(err => res.json(err));

  });

  router.put("/user/:id", async (req, res) => {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (!user) {
      return res.status(422).json({ "message": `User Not Found, Id : ${req.params.id}` });
    }

    //update data user
    user.name = req.body.name;
    user.birth = req.body.birth;
    await user.save();

    return res.json({ "message": `Success Update User : ${req.params.id}`, "data": user });
  });

  router.delete("/user/:id", (req, res) => {
    User.destroy({
      where: { id: req.params.id },
      include: [Income, Expense]
    }).then(data => {
      if(!data){
        return res.status(422).json({ "message": `User Not Found, Id : ${req.params.id}`});
      }
      res.json({ "message": `Success Delete User, Id : ${req.params.id}`});
    }).catch(err => res.json(err));
  });
};