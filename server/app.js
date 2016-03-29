import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import rethink from 'rethinkdb'
import shortId from 'shortid'
import db from './database'
import http from 'http'
import socketio from 'socket.io'

var app = express();
var server = http.Server(app);
var io = socketio(server);

server.listen(3000, function() {
	console.log('app listening on port 3000')
});

app.use('/static', express.static(__dirname + '/../client_build'));
//app.use('/client', express.static(__dirname + '/../client'));
app.use(bodyParser.json());

function handleError(response, statusCode = 500) {
	return function(error) {
		response.status(statusCode);
		response.send({error: error.message});
	}
}

var pollsTable = db.table;

var connection = null;
rethink.connect({host: db.host, port: db.port, db: db.db}, function(error, conn) {
	if(error) {
		throw error;
	}
	connection = conn;
});

app.post('/new', function(request, response) {

	if(!request.body.question) {
		handleError(response, 400)(new Error("A poll question must be provided."));
	}

	if(request.body.options.length < 2) {
		handleError(response, 400)(new Error("At least 2 poll options must be entered."));
	}

	var saveObject = request.body;
	saveObject.id = shortId.generate();

	for( var option in saveObject.options ) {
		saveObject.options[option].votes = 0;
	}

	rethink.table(pollsTable)
		.insert(saveObject)
		.run(connection)
		.then(function(result) {
			if(result.inserted !== 1) {
				handleError(response)(new Error("Poll was not saved due to database error."));
			} else {
				response.status(201);
				response.send({"url": saveObject.id});
			}
		})
		.error(handleError(response))
});

app.get('/poll/:id', function(request, response) {
	rethink.table(pollsTable).get(request.params.id)
		.run(connection)
		.then(function(result) {
			if(result !== null) {
				response.status(200);
				response.send(result);
			} else {
				handleError(response, 404)(new Error("Poll not found. Check the URL and try again."))
			}
		})
		.error(handleError(response))
});

app.get('/poll/:id/initData', function(request, response) {
	rethink.table(pollsTable).get(request.params.id).pluck('question', 'options')
		.run(connection)
		.then(function(result) {
			if(result !== null) {
				console.log(result);
				response.status(200);
				response.send(result);
			} else {
				handleError(response, 404)(new Error("Poll not found. Check the URL and try again."))
			}
		})
		.error(handleError(response))
});

function optionsPicked( options ) {
	if( !options ) {
		return false;
	}

	if( Array.isArray( options ) && options.length <= 0 ) {
		return false;
	}

	return true;
}

function updatePollVotes(pollId, pollOptions) {

	return new Promise( function(resolve, reject) {
		rethink.table(pollsTable).get(pollId).update(
			{options: pollOptions}
		).run(connection)
		.then(function(result) {
			resolve();
		})
		.error(function(error) {
			reject();
		});
	});
}

app.put('/poll/:id', function(request, response) {

	if( !optionsPicked( request.body.picked )) {
		handleError(response, 400)(new Error("You must pick an option."));
	} else {
		rethink.table(pollsTable).get(request.params.id)('options')
			.run(connection)
			.then(function(result) {

				var pollOptions = result;

				if( Array.isArray( request.body.picked )) {
					request.body.picked.forEach( function( current ) {
						++pollOptions[current].votes;
					})
				} else {
					++pollOptions[request.body.picked].votes;
				}

				updatePollVotes( request.params.id, pollOptions )
					.then(function() {
						response.status(200);
						response.send();
					})
					.catch(function() {
						handleError(response, 500)(new Error("A database error occured."));
					})

			})
			.error(function(error) {
				handleError(response);
			});

	}
});

app.get('/poll/:id/results', function(request, response) {
	// return poll results for poll with this :id
});

app.get('*', function(request, response) {
	response.sendFile( path.resolve(__dirname + '/../client_build/index.html') );
});

//app.listen(3000, function() {
//	console.log('app listening on port 3000')
//});

io.on('connection', function(socket) {
	socket.on('room', function(room) {
		socket.join(room);
		startChangefeed(io, room);
	})
});

function startChangefeed(io, pollId) { //TODO: .get().pluck().changes() doesn't work. Only works without pluck, even though the docs say otherwise.
	rethink.table(pollsTable)
		.get(pollId)
		//.pluck('question', 'options')
		.changes({includeInitial: true})
		.run(connection, function(error, cursor) {
			cursor.on("data", function(data) {
				var updateData = [];

				data.new_val.options.forEach(function(option) {
					updateData.push(option.votes);
				});

				io.to(pollId).emit('update_data', {
					updateData: updateData
				});
			})
		})
}