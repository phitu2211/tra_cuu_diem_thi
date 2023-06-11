require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const { CONTACT_ENDPOINT, NEWSLETTER_ENDPOINT } = require('./endpoint.js');
const API_KEY = process.env.API_KEY || '';
const CAMPAIGN_ID = process.env.CAMPAIGN_ID || 'Pq2a0';

const template = fs.readFileSync(
	path.resolve(__dirname, '../message_template_1686476082.html'),
	'utf8'
);

const customHeaders = {
	'Content-Type': 'application/json',
	'X-Auth-Token': 'api-key ' + API_KEY,
};

async function createContact(data) {
	const body = {
		campaign: {
			campaignId: CAMPAIGN_ID,
		},
		email: data.email,
		name: data.name,
	};

	const res = await fetch(CONTACT_ENDPOINT, {
		method: 'POST',
		headers: customHeaders,
		body: JSON.stringify(body),
	});

	if (res.status != 202) return null;

	return await res.json();
}

async function getContactIdByEmail(email) {
	const params = new URLSearchParams({
		'query[email]': email,
		fields: 'contactId',
	});

	const res = await fetch(`${CONTACT_ENDPOINT}?${params}`, {
		method: 'GET',
		headers: customHeaders,
	});

	if (res.status != 200) return null;

	const json = await res.json();
	return json.length > 0 ? json[0].contactId : null;
}

async function createNewsLetter(data) {
	const body = {
		content: {
			html: template,
		},
		flags: ['openrate', 'clicktrack'],
		// editor: 'getresponse',
		name: 'Demo email',
		subject: 'Marketing',
		fromField: {
			fromFieldId: 'z96Nr',
		},
		replyTo: {
			fromFieldId: 'z96Nr',
		},
		campaign: {
			campaignId: CAMPAIGN_ID,
		},
		sendSettings: {
			selectedCampaigns: [],
			selectedSuppressions: [],
			selectedSegments: [],
			selectedContacts: data.contacts,
			excludedCampaigns: [],
			perfectTiming: 'false',
		},
	};

	const res = await fetch(NEWSLETTER_ENDPOINT, {
		method: 'POST',
		headers: customHeaders,
		body: JSON.stringify(body),
	});

	// if (res.status != 201) return null;

	return await res.json();
}

module.exports = {
	createContact,
	getContactIdByEmail,
	createNewsLetter,
};
