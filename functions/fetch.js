const fetch = require('node-fetch')
const feeds = [
  'https://www.waldnet.nl/script/rss.php',
  'https://112fryslan.nl/feed/',
  'https://feed.lc.nl/?service=rss',
  'https://www.rtlnieuws.nl/rss.xml',
  'http://feeds.feedburner.com/tweakers/mixed',
  'https://www.rivm.nl/nieuws/rss.xml',
  'http://feeds.nos.nl/nosjournaal'
]

const fetchAll = async () => {
  const reqs = []
  for (let i = 0, c = feeds.length; i < c; i++) {
    reqs[i] = fetch(feeds[i]).then(r => r.text())
  }
  return await Promise.all(reqs)
}

const handler = async(event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(await fetchAll())
  }
}

module.exports = { handler }
