
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