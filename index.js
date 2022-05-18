addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let res = await fetch('https://finance.yahoo.com/quote/AAPL')
  // let data = await res.text()
  //get the body of the response
  let body = await res.text()
  // console.log(body)
  let ticker = 'TSLA'
  let price = -1
  try {
    price = body
      .split(`"${ticker}":{"sourceInterval"`)[1]
      .split('regularMarketPrice')[1]
      .split('fmt":"')[1]
      .split('"')[0]

    price = parseFloat(price.replace(',', ''))

    const currencyMatch = body.match(/Currency in ([A-Za-z]{3})/)
    let currency = null
    if (currencyMatch) {
      currency = currencyMatch[1]
    }
  } catch (err) {
    console.log(err)
    price = -1
    return -1
  }

  return new Response(price, {
    headers: { 'content-type': 'text/plain' },
  })
}
