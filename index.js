addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  //get the stock symbol from the url
  const url = new URL(request.url)
  const symbol = url.searchParams.get('s')
  if (!symbol) {
    return new Response('No symbol provided', {
      status: 400,
      statusText: 'Bad Request',
      //allow CORS
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
      },
    })
  }
  let price = -1
  try {
    let res = await fetch(`https://finance.yahoo.com/quote/${symbol}/`)
    // let data = await res.text()
    //get the body of the response
    let body = await res.text()
    // console.log(body)

    price = body
      .split(`"${symbol}":{"sourceInterval"`)[1]
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
    return new Response('Error', {
      status: 500,
      statusText: 'Internal Server Error',
      //allow CORS
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
      },
    })
  }

  return new Response(price, {
    //allow CORS
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'text/plain',
    },
  })
}
