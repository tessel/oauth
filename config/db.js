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
