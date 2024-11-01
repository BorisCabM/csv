const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use(require("./routes/index"));

app.listen(port, () => {
  console.log(`Server on port ${port}`); 
});