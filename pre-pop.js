const getCKUrlParam = (urlParam) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    for (const [name, value] of urlParams) {
        if (name.toLowerCase() === urlParam.toLowerCase()) {
            return value;
        }
    }
    return null;
};

const name = getCKUrlParam("fn");
const email = getCKUrlParam("em");

const firstNameField = document.getElementsByName("fields[first_name]")[0];
const emailField = document.getElementsByName("email_address")[0];

if (firstNameField) {
    firstNameField.value = name || '';
}
if (emailField) {
    emailField.value = email || '';
}
