
# if connecting the mysql with creating the seprate user and assinging all the required permissions(secure for production)

const connection = mysql.createConnection({
  host: "localhost",
  user: "blog_user",
  password: process.env.DB_PASSWORD,
  database: "blog_db",
});

# if connecting the mysql with the root, not much secure as can expose your main sql root password in production(if vulnarability occurs)

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_root_password",
  database: "blog_db",
});

# to connect with DB

    // WAY 1
  createConnection()
Node.js
   │
   └────── 1 connection ────── MySQL

   // WAY 2
  createPool()
                    ┌── connection 1 ──┐
Node.js ────────────┼── connection 2 ──┼── MySQL
                    ├── connection 3 ──┤
                    └── connection 4 ──┘

                    createConnection()	  createPool()
Connections	          One	                Multiple/reusable
Concurrent requests	  Limited	            Better
Reuses connections	  ❌	                  ✅
Good for Express API	Okay for small apps	  Recommended
Production	          Usually not ideal	    Recommended