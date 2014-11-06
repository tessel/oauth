# Tessel OAuth2 server: setup and config.

## Prerequisites

You'll need node.js/npm, PostgreSQL, and Redis installed.

On Mac OS X this is best done via [homebrew](http://brew.sh/):

> brew install node postgresql redis

…and it should also output instructions for starting up the respective daemons via launchd or manually (e.g. `postgres -D /usr/local/var/postgres` and `redis-server /usr/local/etc/redis.conf`).

After checking out this repo, you'll also need to fetch its dependencies with:

> npm install


## DB setup

Next step is to setup the DB server, create a new DB and setup the db
config in the app.

1. We are using PostgreSQL, make sure to install it and create a
   user with full access to the DB the app will be using. (On OS X, the default brew install provides such a user, see sample settings in next step.)

2. Next we need to create the DB oauth_development (or staging,
   production, etc..), and setup the correct connection parameters, you
   can check a full list of this params in the /config/db.js file.

   The actual values for the DB connection configuration
   are pulled from a `.env` file that you need to create, you
   can just copy the `.env.example` file and substitute the actual values
   like DB host, username and password:

   ```
   $ cp .env.example .env
   ```
   
   You may need to add an additional setting for the (development) target database name, e.g. with the default OS X `brew install postgres`:
   
   > DB_USERNAME=username_of_whoever_installed_postgres  
   > DB_PASSWORD=  
   > DB_DEVELOPMENT=postgres  
   

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

### License

MIT or Apache 2.0, at your option.
