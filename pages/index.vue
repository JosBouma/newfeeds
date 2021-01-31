<template>
  <div class="container">
    <div v-for="(guid, idx) in sorted" :key="idx" :class="items[guid].host">
      <span>{{ formatDate(items[guid].date) }}</span>
      <a :href="guid">{{ items[guid].title }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {mapState} from 'vuex'

interface RssItem {
  title : string
  date : Date
  host : string
}

export default Vue.extend({
  name: 'NewsFeedPage',
  data () {
    return {
      feeds: [
        'https://www.waldnet.nl/script/rss.php',
        'https://112fryslan.nl/feed/',
        'https://feed.lc.nl/?service=rss',
        'https://www.rtlnieuws.nl/rss.xml',
        'http://feeds.feedburner.com/tweakers/mixed',
        'https://www.rivm.nl/nieuws/rss.xml'
      ],
      parser: new DOMParser(),
      interval: 0,
      getCache: true
    }
  },

  computed: {
    ...mapState({
      items (state : any) : { [key: string]: RssItem } {
        return state.items
      },

      sorted (state : any) : Array<string> {
        return state.sorted
      },

      count (state : any) : number {
        return state.count
      }
    })
  },

  mounted () {
    clearInterval(this.interval)
    this.interval = window.setInterval(this.requestFeeds.bind(this), 1000 * 60 * 5)
    this.requestFeeds()
  },

  destroyed () {
    window.clearInterval(this.interval)
  },

  methods: {
    async requestFeeds () {
      const proxy = 'https://cors-anywhere.herokuapp.com/'
      const _ = this
      const timeout = 1000 * 60
      for(let i = 0, c = this.feeds.length; i < c; i++) {
        await this.fetchTimeout(proxy + this.feeds[i], { cache: this.getCache ? 'force-cache' : 'default' }, timeout).catch((e) => {
          _.fetchTimeout(proxy + _.feeds[i], { cache: 'default' })
        })
      }
      this.getCache = false
    },

    formatDate (dt : Date) : string {
      return `${dt.toLocaleString('nl-NL', { weekday: 'short' })} ${dt.getDate()} ${dt.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`
    },

    async fetchTimeout (url : string, options? : RequestInit, timeout? : number) : Promise<void> {
      options = options || {}
      const controller = new AbortController()
      options.signal = controller.signal
      if (timeout) {
        window.setTimeout(controller.abort.bind(controller), timeout)
      }
      const xml = await fetch(url, options).then(r => r.text())
      this.$store.commit('ITEMS', this.parser.parseFromString(xml, 'text/xml'))
    }
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
}

a {
  color: #111;
  font-weight: 800;
  font-size: 22px;
  opacity: 0.5;
}

a:hover {
  opacity: 1;
}

a:visited {
  color: #ccc;
}

.container {
  margin: 0 10vw;
}

.container>div {
  padding: 5px clamp(10px, 5vw, 120px);
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-gap: 2vw;
  align-items: center;
  border-bottom: dotted 1px grey;
}

.container>div::before {
  content: "?";
  background: grey;
  width: 20px;
  height: 20px;
  padding: 3px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px #000;
}

.container>div._wwwwaldnetnl::before {
  content: "W";
  background: #0061B0;
}

.container>div._112fryslannl::before {
  content: "112";
  background: red;
}

.container>div._wwwlcnl::before {
  content: "LC";
  background: rgb(232, 234, 255);
  color: #000;
}

.container>div._wwwrtlnieuwsnl::before {
  content: "RTL";
  background: #35a7d7;
}

.container>div._tweakersnet::before {
  content: "T";
  background: #9a0e36;
}

@media all and (max-width: 600px) {
  body {
    font-size: 10px;
  }

  a {
    font-size: 16px;
  }

  .container {
    margin: 0;
    padding: 5px;
  }
}
</style>
