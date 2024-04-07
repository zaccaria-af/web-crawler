function printReport(pages) {
    console.log('Starting report')
    pages = new Map([...pages.entries()].sort((a, b) => b[1] - a[1]))
    for (const [url, count] of pages) {
        console.log(`Found ${count} internal links to ${url}`)
    }
}

module.exports = {
    printReport
}