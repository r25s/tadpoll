// Script to initialize the db before the app is first run.
// The file 'database.js' must have already been created. See 'database.example.js'.

import rethink from 'rethinkdb'
import db from './database'

var connectionPromise = rethink.connect({host: db.host, port: db.port});

connectionPromise
	.then((conn) => {
		createDb(conn)
			.then((result) => {
				console.log(result);

				createTable(conn)
					.then((result) => {
						console.log(result);
						process.exit(0);
					})
					.error((error) => {
						console.log(error);
						process.exit(1);
					})
			})
			.error((error) => {
				console.log(error);
				process.exit(1);
			})

	})
	.error(function(error) {
		console.log(error);
		process.exit(1);
	});

function createDb( connection ) {
	return rethink.dbCreate(db.db).run(connection);
}

function createTable( connection ) {
	return rethink.db(db.db).tableCreate(db.table).run(connection);
}

