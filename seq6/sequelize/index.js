const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');
const api = require("@opentelemetry/api")


const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: 'sqlite-example-database/example-db.sqlite',
	logQueryParameters: true,
	benchmark: true,
	logging: (...args) => {
		const currentSpan = api.trace.getSpan(api.context.active());
		const { traceId } = currentSpan.spanContext();
		console.log(`traceId ${traceId} ${args[0]}`)
	}
});

const modelDefiners = [
	require('./models/user.model'),
	require('./models/instrument.model'),
	require('./models/orchestra.model'),
	// Add more models here...
	// require('./models/item'),
];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);
// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
