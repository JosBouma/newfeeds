const fetch = require('node-fetch')
const feeds = [
  'https://www.waldnet.nl/script/rss.php',
  'https://112fryslan.nl/feed/',
  'https://feed.lc.nl/?service=rss',
  'https://www.rtlnieuws.nl/rss.xml',
  'http://feeds.feedburner.com/tweakers/mixed',
  'https://www.rivm.nl/nieuws/rss.xml',
  'httpz://feeds.nos.nl/nosjournaal',
  'https://www.nu.nl/rss/Algemeen'
]

const fetchAll = async () => {
  const reqs = []
  for (let i = 0, c = feeds.length; i < c; i++) {
    reqs[i] = fetch(feeds[i]).then(r => r.text())
  }
  return await Promise.allSettled(reqs)
}

const handler = async(event) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(await fetchAll())
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: '["elp"]'
    }
  }
}

module.exports = { handler }
