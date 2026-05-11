const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');
const { sequelize } = require('./models');

const routes = require('./routes/routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Blog Website API is running!' });
});

app.use('/api', routes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    await sequelize.sync({ alter: true }); 
    console.log('Database synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
  }
};

startServer();