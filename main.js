const { argv } = require('process')
const { crawlPage } = require('./crawl')
const { printReport } = require('./report')

async function main() {
    if (argv.length !== 3) {
       console.error('Usage: node crawl.js <url>')
       process.exit(1)
    }
    const baseURL = argv[2]
    pages = await crawlPage(baseURL, baseURL, new Map())
    printReport(pages)
 }
 
 main()