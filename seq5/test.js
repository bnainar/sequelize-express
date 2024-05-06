const axios = require("axios");
const baseURL = "http://localhost:8081/api/";
(async () => {
    try {
        // Function to call multiple APIs simultaneously
		const arr = [], calls = [
			axios.get(baseURL + "users"),
			axios.get(baseURL + "instruments"),
			axios.get(baseURL + "instruments"),
			axios.get(baseURL + "instruments"),
			axios.get(baseURL + "users"),
			axios.get(baseURL + "users"),
			axios.get(baseURL + "instruments"),
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
