"use strict";

const api = require("@opentelemetry/api");
const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
	getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { SequelizeInstrumentation } = require('opentelemetry-instrumentation-sequelize');

const {
	OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-proto");
const { Resource } = require("@opentelemetry/resources");
const {
	SEMRESATTRS_SERVICE_NAME,
} = require("@opentelemetry/semantic-conventions");
const logsAPI = require("@opentelemetry/api-logs");
const {
	LoggerProvider,
	SimpleLogRecordProcessor,
	ConsoleLogRecordExporter,
} = require("@opentelemetry/sdk-logs");
const process = require("process");

// To start a logger, you first need to initialize the Logger provider.
const loggerProvider = new LoggerProvider();
// Add a processor to export log record
loggerProvider.addLogRecordProcessor(
	new SimpleLogRecordProcessor(new ConsoleLogRecordExporter())
);
logsAPI.logs.setGlobalLoggerProvider(loggerProvider);

const sdk = new NodeSDK({
	traceExporter: new OTLPTraceExporter(),
	instrumentations: [getNodeAutoInstrumentations(), new SequelizeInstrumentation()],
	resource: new Resource({
		[SEMRESATTRS_SERVICE_NAME]: "seq6",
	}),
});

sdk.start();

const shutdown = () => {
	sdk
		.shutdown()
		.then(
			() => console.log("SDK shut down successfully"),
			(err) => console.log("Error shutting down SDK", err)
		)
		.finally(() => process.exit(0));
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

module.exports = api.trace.getTracer("seq6");
