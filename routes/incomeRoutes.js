const Income = require("../models").Income;
const User = require("../models").User;

module.exports = function (router) {
    router.get("/income", (req, res) => {
        Income.findAll()
            .then(incomes => {
                if (!incomes) {
                    return res.status(422).json({ "message": "There is no Income", "data": {} });
                }
                res.json({ "message": "Success Get All Income", "data": incomes });
            })
            .catch(err => res.json(err));
    });

    router.post("/income", async (req, res) => {
        //update data user
        const user = await User.findOne({ where: { id: req.body.user_id } });
        if (!user) {
            return res.status(422).json({ "message": `User Not Found, Id : ${req.body.user_id}` });
        }
        user.balance += req.body.amount;
        await user.save();

        //then save data income
        Income.create({
            user_id: req.body.user_id,
            description: req.body.description,
            amount: req.body.amount,
            date: req.body.date,
        }).then(data => {
            if (!data) {
                return res.status(422).json({ "message": `Failed Create Income,User Id : ${req.body.user_id}` });
            }
            res.json({ "message": "Success Insert Income", "data": data });
        }).catch(err => res.json(err));
    });

    router.delete("/income/user/:user_id/id/:id", async (req, res) => {
        //update data user
        const user = await User.findOne({ where: { id: req.params.user_id } });
        const income = await Income.findOne({ where: { id: req.params.id, user_id: req.params.user_id } });
        if (!user) {
            return res.status(422).json({ "message": `User Not Found, Id : ${req.params.user_id}` });
        }
        if (!income) {
            return res.status(422).json({ "message": `Income Not Found, User Id : ${req.params.user_id} ,Id : ${req.params.id}` });
        }
        user.balance -= income.amount;
        await user.save();

        //delete income
        Income.destroy({
            where: {
                id: req.params.id,
                user_id: req.params.user_id
            }
        }).then(data => {
            if (!data) {
                return res.status(422).json({ "message": `Failed Delete Income,User Id : ${req.params.user_id} ,Id : ${req.params.id}` });
            }
            res.json({ "message": `Success Delete Income,User Id ${req.params.user_id} ,Id : ${req.params.id}` });
        }).catch(err => res.json(err));
    });
};