# Tadpoll

Tadpoll is a polling app, built with Vue.js, Express.js and RethinkDB. It also uses Chart.js (currently).

It was built purely as an exercise of using Vue.js, Express.js, RethinkDB and Webpack.
It can be seen live at [tadpoll.me](http://www.tadpoll.me).

The app can be run without a running RethinkDB server, but no data will be saved.

## Instructions:
1. Make sure RethinkDB server is running.
2. Copy or rename `server/database.example.js` to `server/database.js`,
add the connection details for the RethinkDB server the app will connect to.
3. Build by running `npm run build-all`. This executes the webpack build process and babel build process.
A directory called `server_build/` will be created as a result.
4. Initialize the database by running `node server_build/init_db.js`.
This ensures that the app has a database to connect to.
5. Run the app with the following command: `node server_build/app.js`. This starts the Express.js server.

The app listens on port 3000 by default.