const express = require('express');
const cors = require('cors');

const healthRoute = require('./routes/health');
const propertiesRoute = require('./routes/properties');

const app = express();

app.use(cors());
app.use(express.json());

// basic server run check
app.get('/', (req, res) => {
  res.send('Backend server is running');
});

// routes
app.use('/api/health', healthRoute);
app.use('/api/properties', propertiesRoute);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
