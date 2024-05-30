const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
const testServerUrl = 'http://20.244.56.144/test';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MDc3MzkwLCJpYXQiOjE3MTcwNzcwOTAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImQyMGNhYWJkLTJiNzItNDZmMC1iODg3LTQwMzUzMjYxNWQ5NCIsInN1YiI6InZlbmthdGFoaW1hdmFyc2hhQGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6ImdvTWFydCIsImNsaWVudElEIjoiZDIwY2FhYmQtMmI3Mi00NmYwLWI4ODctNDAzNTMyNjE1ZDk0IiwiY2xpZW50U2VjcmV0IjoiaUtwRGlDa2ViRWd0WnFhSiIsIm93bmVyTmFtZSI6IlZlbmthdGEgSGltYXZhcnNoYSIsIm93bmVyRW1haWwiOiJ2ZW5rYXRhaGltYXZhcnNoYUBnbWFpbC5jb20iLCJyb2xsTm8iOiIyMUJEMUExMkQwIn0.pEGAj5p2viziuFpybOyY7IZQo7ztGcXxDb0melBuw3E';

let windowState = [];

const fetchNumbers = async (type) => {
    try {
        const response = await axios.get(`${testServerUrl}/${type}`, {
            headers: {
                Authorization: AUTH_TOKEN
            },
            timeout: 500
        });
        return response.data.numbers;
    } catch (error) {
        console.error('Error fetching numbers:', error.message);
        return [];
    }
};

const calculateAverage = (numbers) => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return (sum / numbers.length).toFixed(2);
};

app.get('/numbers/:type', async (req, res) => {
    const type = req.params.type;
    const validTypes = ['primes', 'fibo', 'even', 'rand'];
    if (!validTypes.includes(type)) {
        return res.status(400).send({ error: 'Invalid type' });
    }

    const newNumbers = await fetchNumbers(type);
    const uniqueNewNumbers = newNumbers.filter(num => !windowState.includes(num));

    let windowPrevState = [...windowState];
    windowState = [...windowState, ...uniqueNewNumbers].slice(-WINDOW_SIZE);

    const avg = calculateAverage(windowState);

    res.json({
        numbers: newNumbers,
        windowPrevState,
        windowCurrState: windowState,
        avg
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});