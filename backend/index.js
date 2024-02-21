const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const path = require('path');
const app = express()
const Routes = require("../backend/routes/route")

const PORT = process.env.PORT || 5000

dotenv.config();

app.use(express.json({ limit: '10mb' }))
app.use(cors())



mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

app.use('/api/v2', Routes);

// Catch-all handler for serving index.html
if(process.env.NODE_ENV === 'PRODUCTION'){
app.use(express.static(path.join(__dirname,'../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'), (err) => {
          if (err) {
            res.status(500).send(err);
          }
        });
      });
    
}

app.listen(PORT, () => {
    console.log(`Server started at port no. ${PORT}`)
})