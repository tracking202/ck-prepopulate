getCKUrlParam = (urlParam) => {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const lcParams = new URLSearchParams();

	for (const [name, value] of urlParams) {
		lcParams.append(name.toLowerCase(), value);
	}
	
	return lcParams.get(urlParam.toLowerCase());
};

const name = getCKUrlParam("fn");
const email = getCKUrlParam("em");

document.getElementsByName("fields[first_name]")[0].value = name;
document.getElementsByName("email_address")[0].value = email;
