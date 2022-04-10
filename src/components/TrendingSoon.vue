<template>
  <button type="button" class="btn btn-primary mr-3" @click="sortData()">
    SORT
  </button>
  <button type="button" class="btn btn-info mr-3" @click="sortOrigin()">
    ORIGIN
  </button>
  <div class="list-group row">
    <span
      v-for="(coin, index) in coins"
      :key="index"
      href="#"
      class="list-group-item flex-column align-items-start col-md-4"
    >
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">
          <span class="mr-1">{{ coin.rank }}.</span>{{ coin.name }}
        </h5>
        <small class="font-bold">{{
          new Date(coin.discovered_on * 1000).toLocaleString("en-GB")
        }}</small>
      </div>
      <p class="mb-1">
        <img :src="coin.logo_url" class="img-coin" />
        {{ coin.symbol }}
        <span
          class="badge badge-warning"
          v-if="isAvailableBinance(coin.symbol)"
          @click="copyText(coin.symbol)"
          >Binance</span
        >
        <a
          class="badge badge-info"
          v-if="isAvailableBinance(coin.symbol)"
          :href="getTradingviewUrl(coin.symbol)"
          target="_blank"

          >{{ getPrice(coin.symbol) }}</a
        >
        <router-link :to="{ name: 'show', params: { symbol: coin.symbol+'USDT' }}">show</router-link>

      </p>
    </span>
  </div>
</template>

<script>
import TrendingSoon from "../services/TrendingSoon";

const TRADINGVIEW_URL =
  "https://www.tradingview.com/chart/ZGUryCxz/?symbol=BINANCE%3A";
export default {
  name: "trending-soon",
  data() {
    return {
      coins: [],
      currentTutorial: null,
      currentIndex: -1,
      toggleSort: true,
      firebaseData: [],
      binanceData: [],
    };
  },
  methods: {
    copyText(text) {
      if (!navigator.clipboard) {
        const dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text + "USDT";
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
      } else {
        navigator.clipboard.writeText(text + "USDT");
      }
    },
    getData(...items) {
      this.coins = [...this.coins, ...items];
      // items.forEach((item) => {
      //   this.coins.push(item);
      // });
    },

    getTradingviewUrl(coinName) {
      return TRADINGVIEW_URL + coinName + "USDT";
    },

    async onDataChange(items) {
      let _firebaseData = [];
      this.coins = await this.getTrendingSoon()
      items.forEach((item) => {
        let data = item.val();
        _firebaseData.push(data);
      });
      this.coins.forEach((coin) => {
        if (
          _firebaseData.findIndex((ele) => ele.symbol == coin.symbol) == -1
        ) {
          console.log(coin);
          TrendingSoon.create(coin);
        }
      });
      console.log("_firebaseData:" + _firebaseData.length);
      this.firebaseData = _firebaseData;
    },

    compare(a, b) {
      if (a.discovered_on < b.discovered_on) {
        return -1;
      }
      if (a.discovered_on > b.discovered_on) {
        return 1;
      }
      return 0;
    },
    compareReverse(b, a) {
      if (a.discovered_on < b.discovered_on) {
        return -1;
      }
      if (a.discovered_on > b.discovered_on) {
        return 1;
      }
      return 0;
    },

    compareRank(a, b) {
      if (a.rank < b.rank) {
        return -1;
      }
      if (a.rank > b.rank) {
        return 1;
      }
      return 0;
    },

    pushData() {
      this.coins.forEach((coin) => {
        if (
          this.firebaseData.findIndex((ele) => ele.symbol == coin.symbol) == -1
        ) {
          console.log(coin);
          // TrendingSoon.create(coin);
        }
      });
    },
    sortData() {
      if (this.toggleSort) {
        this.coins = this.coins.sort(this.compare);
        this.toggleSort = false;
      } else {
        this.coins = this.coins.sort(this.compareReverse);
        this.toggleSort = true;
      }
    },

    sortOrigin() {
      this.coins = this.coins.sort(this.compareRank);
    },

    isAvailableBinance(coinName) {
      return (
        this.binanceData.findIndex((ele) => ele.symbol.includes(coinName)) > -1
      );
    },
    getPrice(coinName) {
      if (
        this.binanceData.findIndex((ele) =>
          ele.symbol.includes(coinName + "USD")
        ) > -1
      )
        return (
          this.binanceData.find((ele) => ele.symbol.includes(coinName + "USD"))
            .price + "$"
        );
      return "NULL";
    },

    getTrendingSoon1() {
      return this.axios.get(
        "https://truesight.kyberswap.com/api/v1/trending-soon?timeframe=24h&page_number=0&page_size=10&search_token_name=&search_token_tag="
      );
    },
    getTrendingSoon2() {
      return this.axios.get(
        "https://truesight.kyberswap.com/api/v1/trending-soon?timeframe=24h&page_number=1&page_size=10&search_token_name=&search_token_tag="
      );
    },
    getTrendingSoon3() {
      return this.axios.get(
        "https://truesight.kyberswap.com/api/v1/trending-soon?timeframe=24h&page_number=2&page_size=10&search_token_name=&search_token_tag="
      );
    },
    getTrendingSoon4() {
      return this.axios.get(
        "https://truesight.kyberswap.com/api/v1/trending-soon?timeframe=24h&page_number=3&page_size=10&search_token_name=&search_token_tag="
      );
    },
    getTrendingSoon5() {
      return this.axios.get(
        "https://truesight.kyberswap.com/api/v1/trending-soon?timeframe=24h&page_number=4&page_size=10&search_token_name=&search_token_tag="
      );
    },
    async getTrendingSoon() {
      let promises = [];
      promises.push(this.getTrendingSoon1());
      promises.push(this.getTrendingSoon2());
      promises.push(this.getTrendingSoon3());
      promises.push(this.getTrendingSoon4());
      promises.push(this.getTrendingSoon5());
      let [
        trendingSoon1,
        trendingSoon2,
        trendingSoon3,
        trendingSoon4,
        trendingSoon5,
      ] = await Promise.all(promises);
      return [
        ...trendingSoon1.data.data.tokens,
        ...trendingSoon2.data.data.tokens,
        ...trendingSoon3.data.data.tokens,
        ...trendingSoon4.data.data.tokens,
        ...trendingSoon5.data.data.tokens,
      ];
    },
    getFirebaseData() {
      return TrendingSoon.getAll().on("value", items => items);
    }
  },
  async mounted() {
    await TrendingSoon.getAll().on("value", this.onDataChange);


    await this.pushData();
    await this.axios
      .get("https://api.binance.com/api/v3/ticker/price")
      .then((response) => {
        this.binanceData = response.data;
      });
  },
  beforeUnmount() {
    TrendingSoon.getAll().off("value", this.onDataChange);
  },
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
.img-coin {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.font-bold {
  font-weight: bold;
}
</style>
