import loadState from "./loadState.js";


async function getUser() {
    let localstrg = loadState();

    let application = !!localstrg && !!localstrg?.application && ( /(.+)@(.+){2,}\.(.+){2,}/.test(localstrg.application?.email)) ? {
        ...localstrg.application,
        userEmail: !!localstrg?.application ? localstrg.application?.email.replace(/[^a-zA-Z0-9]/g, "_") : null
    } : null

    return application
}


export default getUser