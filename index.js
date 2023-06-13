const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const { getTableHtml } = require('./untils.js');
const { getResponse } = require('./apis');
require('dotenv').config();

app.use(express.static(__dirname + '/assets'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: process.env.SESSION_SECRET || '',
		saveUninitialized: false,
		resave: false,
		// cookie: {
		// 	maxAge: 1000 * 60 * 100,
		// },
	})
);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.get('/step2', (req, res) => {
	if (!req.session.email || !req.session.contactId) {
		res.sendFile(path.join(__dirname, '/pages/index.html'));
	} else {
		res.sendFile(path.join(__dirname, '/pages/step2.html'));
	}
});

app.post('/step2', async (req, res) => {
	const { name, email, phone } = req.body;

	if (!name || !email || !phone) {
		return res.sendFile(path.join(__dirname, '/pages/index.html'));
	}

	await getResponse.createContact({
		name,
		email,
		phone,
	});

	const contactId = await getResponse.getContactIdByEmail(email);
	req.session.email = email;
	req.session.contactId = contactId;

	res.sendFile(path.join(__dirname, '/pages/step2.html'));
});

app.get('/search', function (req, res, next) {
	const { score, group, limit, branchName } = req.query;
	let tableDataHTML = getTableHtml(score, group, branchName, limit);
	res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

	res.write(tableDataHTML);
	res.end();
});

app.get('/step3', (req, res) => {
	res.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.post('/step3', async (req, res) => {
	const { score, group, branchName } = req.body;

	const email = req.session.email;
	const contactId = req.session.contactId;

	if (!email || !contactId)
		return res.sendFile(path.join(__dirname, '/pages/index.html'));

	if (!score) {
		return res.sendFile(path.join(__dirname, '/pages/step2.html'));
	}

	// await getResponse.updateContact(contactId, {
	// 	score,
	// 	group,
	// 	branchName,
	// 	email,
	// });

	getResponse
		.createNewsLetter({
			contacts: [contactId],
			score,
			group,
			branchName,
		})
		.then((response) => {
			req.session.destroy();
		})
		.catch((err) => console.error(err));

	res.sendFile(path.join(__dirname, '/pages/step3.html'));
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
