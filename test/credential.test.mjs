import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { XentralApi } = require('../dist/credentials/XentralApi.credentials.js');

const credential = new XentralApi();

// Evaluates the body of an n8n "={{ ... }}" expression as plain JavaScript.
function evaluate(expression, credentials) {
	const body = expression.slice(expression.indexOf('{{') + 2, expression.lastIndexOf('}}'));
	return new Function('$credentials', `return ${body}`)(credentials);
}

function authorization(accessToken) {
	const header = credential.authenticate.properties.headers.Authorization;
	return `Bearer ${evaluate(header, { accessToken })}`;
}

function baseUrl(instanceUrl) {
	return evaluate(credential.test.request.baseURL, { instanceUrl });
}

test('the token is sent exactly as Xentral issued it', () => {
	assert.equal(authorization('2|abcDEF123'), 'Bearer 2|abcDEF123');
});

test('quotes, a pasted Bearer prefix and whitespace are removed from the token', () => {
	assert.equal(authorization('  "Bearer 2|abc DEF\n" '), 'Bearer 2|abcDEF');
});

test('an instance URL without a scheme gets https and loses trailing slashes', () => {
	assert.equal(baseUrl('acme.xentral.com//'), 'https://acme.xentral.com');
});

test('an https instance URL is kept as it is', () => {
	assert.equal(baseUrl(' https://acme.xentral.com '), 'https://acme.xentral.com');
});

test('the credential test reads one product from the v1 API', () => {
	assert.equal(credential.test.request.url, '/api/v1/products');
	assert.equal(credential.test.request.method, 'GET');
});
