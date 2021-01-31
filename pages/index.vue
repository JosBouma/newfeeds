<template>
  <div class="main">
    <div class="container">
      <h1>Feed overzicht</h1>
      <div v-for="(guid, idx) in sorted" :key="idx" :class="items[guid].host">
        <span>{{ formatDate(items[guid].date) }}</span>
        <a :href="guid">{{ items[guid].title }}</a>
      </div>
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

interface StoreState {
  items : { [key: string]: RssItem }
  sorted : Array<string>
  count : number
}

export default Vue.extend({
  name: 'NewsFeedPage',
  data () {
    return {
      parser: new DOMParser(),
      interval: 0,
      getCache: true
    }
  },

  computed: {
    ...mapState({
      items (state : StoreState) : StoreState['items'] {
        return state.items
      },

      sorted (state : StoreState) : Array<string> {
        return state.sorted
      },

      count (state : StoreState) : number {
        return state.count
      }
    })
  },

  mounted () {
    window.clearInterval(this.interval)
    this.interval = window.setInterval(this.requestFeeds.bind(this), 1000 * 60 * 5)
    this.requestFeeds()
  },

  destroyed () {
    window.clearInterval(this.interval)
  },

  methods: {
    async requestFeeds () {
      let docs : string[] = await fetch('/.netlify/functions/fetch').then(r => r.json())
      for(let i = 0, c = docs.length; i < c; i++) {
        this.$store.commit('ITEMS', this.parser.parseFromString(docs[i], 'text/xml'))
      }
    },

    formatDate (dt : Date) : string {
      return `${dt.toLocaleString('nl-NL', { weekday: 'short' })} ${dt.getDate()} ${dt.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`
    }
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
  border: none;
}

html {
  height: 100%;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
}

#__nuxt,
#__layout,
.main {
  min-height: 100%;
}

.container {
  margin: 0 2vw;
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

.container>div {
  padding: 5px;
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

.container>div._wwwrivmnl::before {
  content: 'R';
  background: #f9e11e;
  color: #000;
  font-weight: 800;
}

.container>div._feedsnosnl::before {
  content: "NOS";
  background: #E61E14;
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
