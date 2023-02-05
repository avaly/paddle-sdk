import nock from 'nock';

export const SERVER = 'http://test.paddle.com';

export default function getNock() {
	return nock(SERVER, {
		reqheaders: {
			'user-agent': /paddle-sdk\/\d+/,
		},
	});
}
