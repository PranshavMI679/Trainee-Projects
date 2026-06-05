require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { connectDB } = require('./config/db');
const { sequelize } = require('./models');

const routes = require('./routes/routes');

const errorMiddleware = require('./middleware/errorMiddleware');
const AppError = require('./utils/appError');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Form Task API is running!' });
});

app.use('/api', routes);

app.all('*catchall', (req, res, next) => {
  next(new AppError(`The endpoint ${req.originalUrl} does not exist on this server.`, 404));
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    await sequelize.sync({ alter: false }); 
    console.log('Database synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

startServer();
