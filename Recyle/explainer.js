async function b() {
    try {
        let errorn = new Error("Something went wrong buddy")
        // Error.captureStackTrace(error, b)
        throw errorn;
    } catch (error) {
        console.log(error)
    }

}

function a() {
    b()
}

a()

// The line Error.captureStackTrace(error, b) essentially means "capture the stack trace for the error object, but exclude the b function from the stack trace."