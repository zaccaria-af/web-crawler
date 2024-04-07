const { JSDOM } = require('jsdom')

function getURLsFromHTML(htmlBody, baseURL) {
   const dom = new JSDOM(htmlBody)
   const aTagElements = dom.window.document.querySelectorAll('a')
   const urls = []
   for (const element of aTagElements) {
      if (element.href.startsWith('/')) {
         try {
            urls.push(new URL(element.href, baseURL).href)
         } catch (error) {
            console.error(`Error: ${error} for href: ${element.href}`)
         }
      } else {
         try {
            urls.push(new URL(element.href).href)
         } catch (error) {
            console.error(`Error: ${error} for href: ${element.href}`)
         }
      }
   }
   return urls
}

function normalizeURL(url) {
   const myURL = new URL(url)
   const hostname = myURL.hostname
   let path = myURL.pathname
   path = path.endsWith('/') ? path.slice(0, -1) : path
   return `${hostname}${path}`
}

async function crawlPage(baseURL, currentURL, pages) {
   const currentURLObj = new URL(currentURL)
   const baseURLObj = new URL(baseURL)
   if (currentURLObj.hostname !== baseURLObj.hostname) {
      return pages
   }

   const normalizedURL = normalizeURL(currentURL)

   if (pages.has(normalizedURL)) {
      pages.set(normalizedURL, pages.get(normalizedURL) + 1)
      return pages
   }

   pages.set(normalizedURL, 1)

   console.log(`Crawling ${currentURL}`)
   let htmlBody = ''
   try {
      const response = await fetch(currentURL)
      if (!response.ok) {
         console.log(`Failed to fetch: ${currentURL}`)
         return pages
      }
      else if (response.headers.get('content-type').indexOf('text/html') === -1) {
         console.log(`Skipping non-HTML: ${currentURL}`)
         return pages
      }
      htmlBody = await response.text()
   } catch (error) {
      console.error(`Error: ${error}`)
   }

   const nextURLs = getURLsFromHTML(htmlBody, currentURL)
   for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages)
   }
   return pages
}

module.exports = {
   normalizeURL,
   getURLsFromHTML,
   crawlPage
}
