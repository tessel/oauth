# Tessel OAuth2 server: setup and config.
## DB setup

First step is to setup the DB server, create a new DB and setup the db
config in the app.

1. We are using PostgreSQL, make sure to install it and create a
   user with full access to the DB the app will be using.

2. Next we need to create the DB oauth_development (or staging,
   production, etc..), and setup the correct connection parameters, you
   can check a full list of this params in the /config/db.js file.

   Example of `/config/db.js`

   ```javascript
   require('dotenv').load();

   var host = process.env.DB_HOST || "127.0.0.1";

   module.exports = {
     "development": {
       "username": process.env.DB_USERNAME,
       "password": process.env.DB_PASSWORD,
       "database": "oauth_development",
       "host": host,
       "dialect": "postgres"
     },
     "test": {
       "username": process.env.DB_USERNAME,
       "password": process.env.DB_PASSWORD,
       "database": "oauth_test",
       "host": host,
       "dialect": "postgres"
     },
     "production": {
       "username": process.env.DB_USERNAME,
       "password": process.env.DB_PASSWORD,
       "database": "oauth_production",
       "host": host,
       "dialect": "postgres"
     }
   }
   ```

   As you can see in the example above the actual values for the DB
   connection are pulled from a `.env` file that you need to create, you
   can just copy the `.env.example` file and substitute the actual values
   like DB host, username and password:

   ```
   $ cp .env.example .env
   ```

3. If everything was successfully installed and configured you should
   now be able to run migrations to create the DB tables and update them
   as needed, just run the following command from the root folder:

   ```
   $ make migrate
   ```

   You should see all the tables created and updated to the last migration.

4. The final step is to create a couple of seeds for users and clients,
   just run:

   ```
   $ node ./seeds/seed
   ```

With this the DB should be ready to go, next step session store.

## Session Store setup

The next step is to setup the the redis server to use as our session
store.

1. First download and install redis server following the instructions
   here: http://redis.io/topics/quickstart/

2. Make sure to create a session secret and store it in  your `.env`
   config file.

3. Last step for session store is to actually run the redis server, just
   run:

   ```
   $ redis-server
   ```

## Running the OAuth server app:

For testing we are using port 3002 when running the OAuth server and to
enable the connection from Tessel-Cloud, from the app root directory, just run:

```
$ PORT=3002 npm start
```

This is all the configuration you need to do to run the app, you should
now be able to go to `http://127.0.0.1:3002/register` to create a new
user, after you create a new user you can request the user profile using
the `/users/profile` path and passing along the client apps creds.
