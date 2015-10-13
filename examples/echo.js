'use strict';

var path = require('path');
var dtls = require('../index');

const opts = {
	cert: path.join(__dirname, '../test/public.der'),
	key: path.join(__dirname, '../test/private.der'),
	debug: 5
};

const dtlsserver = dtls.createServer(opts, socket => {
	console.log('secure connection from', socket.address, socket.port);
	socket.on('message', msg => {
		//console.log('received:', msg.toString('utf8'));
		socket.send(msg);
		if (msg.toString('utf8').indexOf('close') === 0) {
			console.log('closing');
			dtlsserver.close();
		}
	});
	socket.once('close', () => {
		console.log('closing socket from', socket.address, socket.port);
	});
});
dtlsserver.on('error', err => {
	console.error(err);
});
dtlsserver.on('listening', () => {
	const addr = dtlsserver.address();
	console.log(`dtls listening on ${addr.address}:${addr.port}`);
});
dtlsserver.listen(5683);
