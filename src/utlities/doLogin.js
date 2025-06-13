import saveState from "./saveState";

function doLogin(e) {
    e.preventDefault();
    let application = {
        email: document.getElementById("emailInput")?.value,
        user: document.getElementById("userInput")?.value,
    }
    saveState({ application })
    window.location.reload();
}


export default doLogin