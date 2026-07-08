const express = require('express');
const cors = require('cors');

const healthRoute = require('./routes/health');
const propertiesRoute = require('./routes/properties');

const app = express();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        console.log(`${timestamp} ${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms`);
    });

    next();
});

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
