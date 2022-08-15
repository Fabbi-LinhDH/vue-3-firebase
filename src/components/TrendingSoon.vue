<template>
  <button type="button" class="btn btn-primary mr-3" @click="sortData()">
    SORT
  </button>
  <button type="button" class="btn btn-info mr-3" @click="sortOrigin()">
    RANK
  </button>

  <button
    type="button"
    class="btn btn-primary mr-3"
    @click="changeDisplay('all')"
  >
    ALL
  </button>
  <button
    type="button"
    class="btn btn-primary mr-3"
    @click="changeDisplay('origin')"
  >
    Origin
  </button>

  <button
    type="button"
    class="btn btn-primary mr-3"
    @click="changeDisplay('favorite')"
  >
    Favorite
  </button>

  <!-- Modal -->
  <div
    v-if="show"
    class="modal fade show"
    tabindex="-1"
    role="dialog"
    :style="show ? 'display: block' : 'display: none'"
  >
    <div class="modal-dialog modal-custom" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ symbol }}</h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="show = false"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <Show :symbol="symbol" />
        </div>
      </div>
    </div>
  </div>
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
        <template v-if="isAvailableBinance(coin.symbol)">
          <span class="badge badge-warning mr-2" @click="copyText(coin.symbol)"
            >Binance</span
          >
          <a
            class="badge badge-info mr-2"
            :href="getTradingviewUrl(coin.symbol)"
            target="_blank"
            >{{ getPrice(coin.symbol) }}</a
          >
          <span
            role="button"
            class="badge badge-success mr-2"
            @click="(show = true), (symbol = coin.symbol + 'USDT')"
            >show</span
          >
          <i
            v-if="checkFavorite(coin.symbol)"
            role="button"
            class="bi bi-bookmark-heart-fill red"
            @click="unBookmarkCoin(coin)"
          ></i>
          <i
            v-else
            role="button"
            class="bi bi-bookmark-heart"
            @click="bookmarkCoin(coin)"
          ></i>


          <!-- <router-link :to="{ name: 'show', params: { symbol: coin.symbol+'USDT' }}">show</router-link> -->
        </template>
      </p>
    </span>
  </div>
</template>

<script>
import TrendingSoon from "../services/TrendingSoon";
import Favorite from "../services/Favorite";
import Show from "./Show.vue";
const TRADINGVIEW_URL =
  "https://www.tradingview.com/chart/ZGUryCxz/?symbol=BINANCE%3A";
export default {
  name: "trending-soon",
  components: { Show },
  data() {
    return {
      coins: [],
      coinsOrigin: [],
      coinsFavorite: [],
      currentTutorial: null,
      currentIndex: -1,
      toggleSort: true,
      firebaseData: [],
      binanceData: [],
      symbol: "",
      show: false,
      displayType: "origin",
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
      items.forEach((item) => {
        let data = {
          _key: item.key,
          ...item.val()
        }
        _firebaseData.push(data);
      });
      // this.coins.forEach((coin) => {
      //   if (_firebaseData.findIndex((ele) => ele.symbol == coin.symbol) == -1) {
      //     console.log(coin);
      //     // TrendingSoon.create(coin);
      //   }
      // });
      console.log("_firebaseData:" + _firebaseData.length);
      this.firebaseData = _firebaseData;
      await this.pushData();
    },

    async onDataFavoriteChange(items) {
      let _firebaseData = [];
      if (items)
        items.forEach((item) => {
          let data = {
            _key: item.key,
            ...item.val()
          }
          _firebaseData.push(data);
        });
      this.coinsFavorite = _firebaseData;
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
      // console.log("this.firebaseData", this.firebaseData)
      // console.log("this.coins", this.coins)
      this.coins.forEach((coin) => {
        if (
          this.firebaseData.findIndex((ele) => ele.symbol == coin.symbol) == -1
        ) {
          console.log("pushData", coin);
          TrendingSoon.create(coin);
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
    changeDisplay(type) {
      switch (type) {
        case "all":
          this.coins = this.firebaseData;
          this.displayType = "all";
          break;
        case "origin":
          this.coins = this.coinsOrigin;
          this.displayType = "origin";
          break;
        case "favorite":
          this.coins = this.coinsFavorite;
          this.displayType = "favorite";
          break;
        default:
          this.coins = this.firebaseData;
          break;
      }
    },
    bookmarkCoin(coin) {
      Favorite.create(coin);
    },
    unBookmarkCoin(coin) {
      let delCoinIdx = this.coinsFavorite.findIndex(ele => ele.symbol == coin.symbol)
      console.log(delCoinIdx)
      if (delCoinIdx > -1) {
        Favorite.delete(this.coinsFavorite[delCoinIdx]._key)
        this.coinsFavorite.slice(delCoinIdx)
        if (this.displayType == 'favorite')
          this.coins = this.coinsFavorite
      }
    },

    checkFavorite(coin) {
      let list = this.coinsFavorite.map(ele => ele.symbol)
      return list.includes(coin)
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
      return TrendingSoon.getAll().on("value", (items) => items);
    },
  },
  async mounted() {
    this.coins = await this.getTrendingSoon();
    this.coinsOrigin = await this.getTrendingSoon();
    await TrendingSoon.getAll().on("value", this.onDataChange);
    await Favorite.getAll().on("value", this.onDataFavoriteChange);

    // await this.pushData();
    await this.axios
      .get("https://api.binance.com/api/v3/ticker/price")
      .then((response) => {
        this.binanceData = response.data;
      });
  },
  beforeUnmount() {
    TrendingSoon.getAll().off("value", this.onDataChange);
    Favorite.getAll().off("value", this.onDataFavoriteChange);
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
.modal-custom {
  max-width: 100% !important;
  width: 100% !important;
}
.red {
  color: crimson;
}
</style>
