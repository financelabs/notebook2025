function generateUser() {
    const dateTime = new Date();
    let month = (dateTime.getMonth() + 1);
    let day = dateTime.getDay();
    let seconds = dateTime.getSeconds();
    let mllseconds = dateTime.getMilliseconds();

    if (month.toString().length < 2) {
        month = '0' + (dateTime.getMonth() + 1);
    }

    if (seconds.toString().length < 2) {
        seconds = '0' + dateTime.getMinutes();
    }

    let email = "user-" + month + '-' + day + '-' + seconds + '-' + mllseconds + "@gmail.com";
    return {
        email: email,
        user: "Anonymous " + mllseconds + seconds,
        userEmail: email.replace(/[^a-zA-Z0-9]/g, "_")
    }
}

export default generateUser