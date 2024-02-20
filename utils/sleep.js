const sleep = async (timeMs = 200) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeMs)
    })
}

module.exports = sleep;