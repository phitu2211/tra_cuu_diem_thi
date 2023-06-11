require('dotenv').config();

const BASE_URL =
	process.env.BASE_URL_GET_RESPONSE || 'https://api.getresponse.com/v3';
const CONTACT_ENDPOINT = BASE_URL + '/contacts';
const NEWSLETTER_ENDPOINT = BASE_URL + '/newsletters';
const CAMPAIGN_ENDPOINT = BASE_URL + '/campaigns';

module.exports = {
	CONTACT_ENDPOINT,
	NEWSLETTER_ENDPOINT,
	CAMPAIGN_ENDPOINT,
};
