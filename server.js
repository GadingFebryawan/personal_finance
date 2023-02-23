const express = require("express");
const bodyparser = require("body-parser");
const port = process.env.PORT || 3003;

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

require("./routes/userRoutes")(app);
require("./routes/incomeRoutes")(app);
require("./routes/expenseRoutes")(app);
app.get('*', function (req, res) {
    res.status(404).json({ 'message': "Url Not Found" });
});

app.listen(port, () => console.log(`Server started on ${port}`));