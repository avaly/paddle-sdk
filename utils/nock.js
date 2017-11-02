const nock = require('nock');

const SERVER = 'http://test.paddle.com';

function getNock() {
	return nock(SERVER, {
		reqheaders: {
			'user-agent': /paddle-sdk\/\d+/,
		},
	});
}

module.exports = getNock;
module.exports.SERVER = SERVER;
