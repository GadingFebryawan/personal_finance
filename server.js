const express = require("express");
const bodyparser = require("body-parser");
const port = process.env.PORT || 3003;

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

require("./routes/userRoutes")(app);
require("./routes/incomeRoutes")(app);
require("./routes/expenseRoutes")(app);

app.listen(port,() => console.log(`Server started on ${port}`));