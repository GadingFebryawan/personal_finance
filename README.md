# personal_finance
web service about your balance,income and expense
# How To Use
1. Git Clone
2. npm install
3. npm install sequelize-cli (I use sequelize because it makes easier for me to do something like create model,migration and query to database)
4. node server (host and port is default setting to localhost:3003)
# API
1. User
    - getAllUser (method : get, url : "/user")
    - getUserById (method : get, url : "/user/:id")
    - deleteUserById (method : delete, url : "/user/:id")
    - editUserById (method : put, url : "/user/:id", body : {"name" : "Name", "birth" : "2023-02-23"})
    - storeUser (method : post, url : "/user", body : {"name" : "Name", "birth" : "2023-02-23", "balance" : 0, "default_balance" : 0})
2. Income
    - getAllIncome (method : get, url : "/income")
    - storeIncome (method : post, url : "/income", body : {"user_id" : 99, "description" : "income in january 2023", "amount" : 2000000, "date" : "2023-01-25"})
    - deleteIncome (method : delete, url : "/income/user/:id_user/id/:id_income")
3. Expense
    - getAllExpense (method : get, url : "/expense")
    - storeExpense (method : post, url : "/expense", body : {"user_id" : 99, "description" : "expense in january 2023", "amount" : 25000, "date" : "2023-01-28"})
    - deleteExpense (method : delete, url : "/expense/user/:id_user/id/:id_expense")
