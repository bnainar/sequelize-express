const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');
const {ns} = require("../cls")
const shimmer = require('shimmer');
Sequelize.useCLS(ns) // this + cls-hooked looks promising
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: 'sqlite-example-database/example-db.sqlite',
	logQueryParameters: true,
	benchmark: true,
	logging: (...args) => {
		if(args[2].traceId !== ns.get("traceId")) {
			throw new Error("wrong context")
		}
		console.log(`${args[2].traceId ?? "nil"} ${args[0]}`)
	}
});

shimmer.wrap(sequelize, 'query', function (original) {
  return function () {
	// console.log("Before wrapping .query");
	arguments[1].traceId = ns.get("traceId")
	// console.log(arguments)
	var returned = original.apply(this, arguments)
	// console.log("After wrapping .query");
	return returned;
  };
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
