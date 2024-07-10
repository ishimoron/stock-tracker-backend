const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { sendEmail } = require('./mail');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;
const FIELDS = 'symbol,name,price,low,high';

const getIndicesData = async () => {
	try {
		const { data } = await axios.get(
			`https://www.wallstreetoddsapi.com/api/livestockprices?&apikey=${API_KEY}&fields=${FIELDS}&format=json&symbols=allsymbols`,
		);
		return data.response;
	} catch (error) {
		console.log(error);
	}
};

app.get('/api/indices', async (req, res) => {
	try {
		const data = await getIndicesData();
		const formattedData = data.slice(0, 10).map(item => {
			return {
				...item,
				date: new Date().toLocaleDateString(),
			};
		});
		res.json(formattedData);
	} catch {
		res.status(500).json({ error: 'Error fetching data...' });
	}
});

app.post('/api/setThresholds', async (req, res) => {
	try {
		const { aboveThreshold, belowThreshold, email, index } = req.body;
		const data = await getIndicesData();
		const foundedIndex = data.find(({ symbol }) => symbol === index);

		if (foundedIndex) {
			// if (foundedIndex.price > aboveThreshold || foundedIndex.price < belowThreshold) {
			// 	here if price changed setup email sending
			// }
			// 

			// just sending testing email to test functionality
			sendEmail({ email, foundedIndex });
		}
		res.json({ message: 'Alert setup successfully' });
	} catch {}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
