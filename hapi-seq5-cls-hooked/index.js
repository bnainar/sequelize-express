require("./trace")
const app = require('./express/app');
const sequelize = require('./sequelize');
const PORT = 8081;

async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`);
	try {
		await sequelize.authenticate();
		console.log('Database connection OK!');
	} catch (error) {
		console.log('Unable to connect to the database:');
		console.log(error.message);
		process.exit(1);
	}
}

async function init() {
	await assertDatabaseConnectionOk();

	console.log(`Starting Sequelize + Express example on port ${PORT}...`);
}

init();
