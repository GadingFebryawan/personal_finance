const Income = require("../models/db").Income;
const User = require("../models/db").User;

module.exports = function (router) {
    router.get("/income", (req, res) => {
        Income.findAll()
            .then(incomes => {
                if (incomes.length == 0) {
                    return res.json({ "message": "There is no Income", "data": [] });
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

    router.put("/income/user/:user_id/id/:id", async (req, res) => {
        try {
            //update data user
            const user = await User.findOne({ where: { id: req.params.user_id } });
            const income = await Income.findOne({ where: { id: req.params.id, user_id: req.params.user_id } });
            if (!user) {
                return res.status(422).json({ "message": `User Not Found, Id : ${req.params.user_id}` });
            }
            if (!income) {
                return res.status(422).json({ "message": `Income Not Found, Id : ${req.params.id}` });
            }
            //define amount current income and new income
            let currentIncome = income.amount;
            let newIncome = req.body.amount;

            //update data income
            income.description = req.body.description;
            income.amount = req.body.amount;
            income.date = req.body.date;
            await income.save();

            //update user balance if balance is change
            if (currentIncome != newIncome) {
                user.balance = (user.balance - currentIncome) + newIncome;
                if (user.balance < 0) {
                    return res.status(202).json({ "message": `User Balance It is not Enough : ${user.balance}` });
                }
                await user.save();
            }

            res.json({ "message": "Success Update Data Income", "data": income });
        } catch (error) {
            res.status(500).json(error);
        }
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