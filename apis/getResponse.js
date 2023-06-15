require('dotenv').config();
const fetch = require('node-fetch');
const { getTemplate } = require('../untils.js');
const {
	CONTACT_ENDPOINT,
	NEWSLETTER_ENDPOINT,
	CAMPAIGN_ENDPOINT,
} = require('./endpoint.js');
const API_KEY = process.env.API_KEY || '';
const CAMPAIGN_ID = process.env.CAMPAIGN_ID || 'Pq2a0';

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
		customFieldValues: [
			{
				customFieldId: 'pUbkon',
				value: [data.phone.replace(/^0/, '+84')],
			},
		],
	};
	console.log(body.customFieldValues);

	const res = await fetch(CONTACT_ENDPOINT, {
		method: 'POST',
		headers: customHeaders,
		body: JSON.stringify(body),
	});

	if (res.status != 202) {
		console.log(await res.json());
		return null;
	}
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

async function updateContact(id, data) {
	const customFieldValues = [];

	if (data.branchName)
		customFieldValues.push({
			customFieldId: 'p1p6Ab',
			value: [data.branchName],
		});

	if (data.group)
		customFieldValues.push({
			customFieldId: 'p1p615',
			value: [data.group],
		});

	if (data.score)
		customFieldValues.push({
			customFieldId: 'p1p6iq',
			value: [data.score],
		});

	const body = {
		// email: data.email,
		customFieldValues,
	};

	const res = await fetch(`${CONTACT_ENDPOINT}/${id}/custom-fields`, {
		method: 'POST',
		headers: customHeaders,
		body: JSON.stringify(body),
	});

	const json = await res.json();

	// if (res.status != 200) return null;

	return json;
}

async function getDetailCampaign() {
	const params = new URLSearchParams({
		fields: 'confirmation',
	});

	const res = await fetch(`${CAMPAIGN_ENDPOINT}/${CAMPAIGN_ID}?${params}`, {
		method: 'GET',
		headers: customHeaders,
	});

	if (res.status != 200) return null;

	const json = await res.json();

	const fromFieldId = json['confirmation']['fromField']['fromFieldId'];
	const replyToId = json['confirmation']['replyTo']['fromFieldId'];

	return {
		fromFieldId,
		replyToId,
	};
}

async function createNewsLetter(data) {
	const template = getTemplate(data);
	const { fromFieldId, replyToId } = await getDetailCampaign();

	const body = {
		content: {
			html: template,
		},
		flags: ['openrate', 'clicktrack'],
		editor: 'getresponse',
		subject: process.env.TITLE_EMAIL || 'Thông tin tìm kiếm trường đại học',
		fromField: {
			fromFieldId: fromFieldId,
		},
		replyTo: {
			fromFieldId: replyToId,
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

	const json = await res.json();

	return json;
}

module.exports = {
	createContact,
	updateContact,
	getContactIdByEmail,
	createNewsLetter,
};
