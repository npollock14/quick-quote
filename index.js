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
  let json = [{}]
  try {
    let res = await fetch(`https://finance.yahoo.com/quote/${symbol}/`)
    // let data = await res.text()
    //get the body of the response
    let body = await res.text()

    price = body
      .split(`"${symbol}":{"sourceInterval"`)[1]
      .split('regularMarketPrice')[1]
      .split('fmt":"')[1]
      .split('"')[0]

    let jsonArea = body
      .split(`"${symbol}":{"sourceInterval"`)[1]
      .split('sourceInterval')[0]
    let index = jsonArea.indexOf(',')
    jsonArea = jsonArea.substring(index + 1)
    index = jsonArea.lastIndexOf(',')
    jsonArea = jsonArea.substring(0, index)
    jsonArea = '[{' + jsonArea + ']'
    // json = JSON.parse(jsonArea)
    json = jsonArea
  } catch (err) {
    console.log(err)
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

  return new Response(json, {
    //allow CORS
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  })
}
