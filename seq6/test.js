const axios = require("axios");

(async () => {
    try {
        // Function to call multiple APIs simultaneously
		const arr = [], calls = [
			axios.get("http://localhost:8080/api/users"),
			axios.get("http://localhost:8080/api/instruments"),
		];
		let TIMES = 1;
		while(TIMES--) {
			arr.push(...calls)
		}
		Promise.all(arr);
	} catch (error) {
		console.error("Error calling APIs:", error);
	}
})();
