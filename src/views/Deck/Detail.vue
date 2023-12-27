<script setup lang="ts">
import i18n from '@/i18n/index';
import type { DeckList, Deck } from 'module-types';
import type { DeckListType } from 'request-data-types';
import type { HasTotalRes } from 'response-data-types';
import { callApi } from '@/util/api';
import { decode } from '@/util';
import ExcelJS from 'exceljs';
import { toPng } from 'html-to-image';

const { t } = i18n.global;

const deck = ref<Deck>();

const route = useRoute();
const imgUrl = ref('');
const dialogVisible = ref(false);
const showRarity = ref(true);
const deckList = ref<null | HTMLElement>(null);
const contentRef = ref<null | HTMLElement>(null);
const allImagesLoaded = ref(false);
const isShowMoney = ref(false);

const checkAllImagesLoaded = async () => {
  const images = contentRef.value?.querySelectorAll('img');
  if (!images) return;

  const totalImages = images.length;
  let loadedImages = 0;

  images.forEach(img => {
    if (img.complete && img.naturalHeight !== 0) {
      loadedImages++;
    } else {
      img.addEventListener('load', () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          allImagesLoaded.value = true; // 所有圖片已加載
        }
      });
      img.addEventListener('error', () => {
        console.error('圖片加載失敗:', img.src);
      });
    }
  });

  if (loadedImages === totalImages) {
    allImagesLoaded.value = true; // 所有圖片已加載
  }
};

const getDataFromDeck = () => {
  const makeDeckArr = (decks: DeckContent[]) => {
    let arr = [];
    for (let i = 0; i < decks.length; i++) {
      const deck = decks[i];
      arr.push([
        deck.card_name,
        deck.card_num_id,
        deck.card_number,
        deck.card_rarity,
        new Date(deck.card_price[0].time).toDateString(),
        deck.card_price[0].price_avg,
        deck.card_price[0].price_lowest,
      ]);
    }
    return arr;
  };
  const deckArr = [
    '卡名',
    '卡號',
    '卡片密碼',
    '稀有度',
    '價格取得時間',
    '價格(均價)',
    '價格(最低)',
  ];
  let data = [];
  // title
  data.push([`牌組名稱 :`, deck.value.title]);
  // create_date
  data.push([`${t('deck.deck_time_create')} :`, deck.value.create_date]);

  data.push([]);
  data.push([]);
  data.push([]);

  // main_deck
  if (deck.value.main_deck.length) {
    data.push([`${t('deck.main_deck')} :`]);
    data.push(deckArr);
    data.push(...makeDeckArr(deck.value.main_deck));
  }

  // extra_deck
  if (deck.value.extra_deck.length) {
    data.push([`${t('deck.extra_deck')} :`]);
    data.push(deckArr);
    data.push(...makeDeckArr(deck.value.extra_deck));
  }

  // side
  if (deck.value.side_deck.length) {
    data.push([`${t('deck.side_deck')} :`]);
    data.push(deckArr);
    data.push(...makeDeckArr(deck.value.side_deck));
  }
  data.push([]);
  data.push([]);
  data.push(['YGO Card Time', 'YGO 卡壇', 'https://ygo-cardtime.orp']);

  return data;
};

const loadToExcel = async () => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    const data = getDataFromDeck();

    worksheet.addRows(data);

    // 樣式
    const font1 = { name: 'Arial', size: 16, bold: true };
    const font2 = { name: 'Arial', size: 16, bold: true };
    let idx = 1;
    worksheet.getRow(idx++).font = font1;
    worksheet.getRow(idx++).font = font1;
    idx += 3;
    // main
    if (deck.value.main_deck.length) {
      worksheet.getRow(idx++).font = font2;
      worksheet.getRow(idx++).font = font2;
      for (let i = 0; i < deck.value.main_deck.length; i++) {
        idx++;
      }
    }
    // extra
    if (deck.value.extra_deck.length) {
      worksheet.getRow(idx++).font = font2;
      worksheet.getRow(idx++).font = font2;
      for (let i = 0; i < deck.value.extra_deck.length; i++) {
        idx++;
      }
    }
    // side
    if (deck.value.side_deck.length) {
      worksheet.getRow(idx++).font = font2;
      worksheet.getRow(idx++).font = font2;
      for (let i = 0; i < deck.value.side_deck.length; i++) {
        idx++;
      }
    }

    // 寬度
    worksheet.columns.forEach((column, index) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const columnLength = cell.value ? cell.value.toString().length : 0;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength * 2 + 5;
    });

    // 行高
    worksheet.eachRow({ includeEmpty: true }, row => {
      row.height = 20;
    });

    const blob = await workbook.xlsx.writeBuffer();
    const blobUrl = URL.createObjectURL(new Blob([blob]));

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'output.xlsx';
    link.click();

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error:', error);
  }
};

const drawWaterMark = (
  ctx: CanvasRenderingContext2D,
  imgWidth: number,
  imgHeight: number,
  wmConfig: { font: string; textArray: string[]; density: number },
) => {
  let fontSize: number;
  // 判斷圖檔與文字
  if (imgWidth >= 3456) {
    fontSize = 50;
  } else if (imgWidth >= 2700) {
    fontSize = 30;
  } else if (imgWidth >= 2000) {
    fontSize = 26;
  } else if (imgWidth >= 1436) {
    fontSize = 20;
  } else if (imgWidth >= 800) {
    fontSize = 12;
  } else if (imgWidth >= 500) {
    fontSize = 10;
  } else {
    fontSize = 8;
  }
  console.log(imgWidth, imgHeight, fontSize);
  ctx.fillStyle = 'white';

  ctx.font = `${fontSize}px ${wmConfig.font}`;
  ctx.lineWidth = 1;
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  //座標
  const maxPx = Math.max(imgWidth, imgHeight);
  // 間距
  const stepPx = Math.floor(maxPx / wmConfig.density);

  let arrayX = [0]; //初始座標
  while (arrayX[arrayX.length - 1] < maxPx / 2) {
    arrayX.push(arrayX[arrayX.length - 1] + stepPx);
  }
  arrayX.push(
    ...arrayX.slice(1, arrayX.length).map(el => {
      return -el;
    }),
  );

  console.log(arrayX);

  for (let i = 0; i < arrayX.length; i++) {
    for (let j = 0; j < arrayX.length; j++) {
      ctx.save();
      ctx.translate(imgWidth / 2, imgHeight / 2); //旋轉
      ctx.rotate(-Math.PI / 5);
      if (wmConfig.textArray.length > 3) {
        wmConfig.textArray = wmConfig.textArray.slice(0, 3);
      }
      wmConfig.textArray.forEach((el, index) => {
        let offsetY = fontSize * index + 2;
        ctx.fillText(el, arrayX[i], arrayX[j] + offsetY);
      });
      ctx.restore();
    }
  }
};

const base64AddWaterMaker = (
  base64Img: string,
  wmConfig: { font: string; textArray: string[]; density: number },
) => {
  if (wmConfig.textArray.length === 0) {
    console.error('****No Content*****');
    return base64Img;
  }

  return new Promise<string>(async (resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    let resultBase64 = '';

    img.onload = async function () {
      canvas.width = img.width;
      canvas.height = img.height;

      //canvas繪製
      ctx.drawImage(img, 0, 0);
      //浮水印
      drawWaterMark(ctx, img.width, img.height, wmConfig);
      resultBase64 = canvas.toDataURL('image/png');

      if (!resultBase64) {
        reject('Failed');
      } else {
        resolve(resultBase64);
      }
    };
    img.src = base64Img;
  });
};

const getImage = async () => {
  toPng(deckList.value)
    .then(async function (dataUrl) {
      imgUrl.value = await base64AddWaterMaker(dataUrl, {
        font: 'Ariel',
        textArray: ['YGO', 'CardTime', '卡壇'],
        density: 3,
      });
      dialogVisible.value = true;
    })
    .catch(function (error) {
      console.error('oops, something went wrong!', error);
    });
};

const changeShowType = () => (showRarity.value = !showRarity.value);

// 卡片詳情彈窗
const onLargeTarget = ref<DeckContent>();
const cardInfoVisible = ref(false);
const openCardInfo = (i: number, type: 'main_deck' | 'extra_deck' | 'side_deck') => {
  onLargeTarget.value = deck.value[type][i];
  cardInfoVisible.value = true;
  console.log(onLargeTarget.value);
};

onMounted(async () => {
  deck.value = decode<HasTotalRes<DeckList>>(
    (
      await callApi<DeckListType>(
        { page: 0, limit: 1, filter: { _id: route.params.id as string } },
        'deck',
        'deckList',
        false,
      )
    ).data,
  ).list[0];
  if (contentRef.value) {
    await checkAllImagesLoaded();
  }
  console.log(deck.value);
});
</script>

<template>
  <div class="deck-detail">
    <div class="btn-box">
      <button @click="getImage">{{ t('deck.download_img') }}</button>
      <button @click="loadToExcel">{{ t('deck.download_excel') }}</button>
      <button @click="changeShowType" :class="{ 'btn-grey': !showRarity }">
        {{ showRarity ? t('deck.showRarity') : t('deck.notShowRarity') }}
      </button>
      <el-checkbox v-if="!showRarity" class="check-fill-price" :label="t('deck.isMondey')" v-model="isShowMoney" />
    </div>
    <div id="deck-list" ref="deckList">
      <div class="deck-title">{{ deck?.title }}</div>
      <div class="title">{{ t('deck.main_deck') }}({{ deck?.main_deck.length }})</div>
      <div class="main-deck">
        <deck-detail-component
          deck-type="main_deck"
          :deck="deck"
          :show-rarity="showRarity"
          :show-money="isShowMoney"
          @card-info="openCardInfo"
        />
      </div>
      <div class="title">{{ t('deck.extra_deck') }}({{ deck?.extra_deck.length }})</div>
      <div class="extra-deck">
        <deck-detail-component
          deck-type="extra_deck"
          :deck="deck"
          :show-rarity="showRarity"
          :show-money="isShowMoney"
          @card-info="openCardInfo"
        />
      </div>
      <div class="title">{{ t('deck.side_deck') }}({{ deck?.side_deck.length }})</div>
      <div class="side-deck">
        <deck-detail-component
          deck-type="side_deck"
          :deck="deck"
          :show-rarity="showRarity"
          :show-money="isShowMoney"
          @card-info="openCardInfo"
        />
      </div>
      <div class="copyright">
        Copyright © 卡壇 YGO Info. All rights reserved. Resource : http://cardtime.tw
      </div>
    </div>
  </div>

  <el-dialog :title="t('deck.download_notice')" v-model="dialogVisible" class="img-download-pop">
    <div class="dialog">
      <img :src="imgUrl" alt="" />
    </div>
  </el-dialog>

  <!-- 卡片詳情彈窗 -->
  <el-dialog v-model="cardInfoVisible" class="card-info-pop">
    <div class="image-dialog">
      <img :src="`/api/card-image/cards/${onLargeTarget?.card_number}.webp`" alt="" />
      <div class="info">
        <div class="name">
          {{ onLargeTarget?.card_name }}
          <span class="pc">({{ onLargeTarget?.card_num_id }})</span>
        </div>
        <div class="name mobile">({{ onLargeTarget?.card_num_id }})</div>
        <div>{{ t('card.rarity') }} : {{ onLargeTarget?.card_rarity }}</div>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.el-dialog.card-info-pop,
.el-dialog.img-download-pop {
  width: 700px;
}
@media (max-width: 768px) {
  .el-dialog.card-info-pop,
  .el-dialog.img-download-pop {
    width: 98vw;
  }
}
</style>

<style lang="scss" scoped>
.deck-detail {
  @apply flex flex-col items-center w-full;
  min-height: calc(100vh - 104px);
  .btn-box {
    @apply flex justify-center items-center flex-wrap;
    margin: 40px auto 0;
    & button {
      color: lightgray;
      border: 1px solid lightgray;
      border-radius: 5px;
      width: 150px;
      height: 36px;
      margin: 0 5px 10px;
      transition-duration: 0.2s;
      &:hover {
        @apply text-white;
        border: 1px solid white;
      }
    }
    .btn-grey {
      @apply bg-gray-700;
    }
    .check-fill-price {
      width: 150px;
      margin: 0 5px 10px;
    }
  }
  #deck-list {
    @apply flex flex-col bg-black;
    width: 1200px;
    padding: 10px 10px 0;
    .deck-title {
      @apply text-white text-2xl font-extrabold;
      margin: 0 0 10px;
    }
    .title {
      @apply text-lg font-extrabold;
      color: lightgray;
    }
    .copyright {
      @apply flex flex-row justify-center w-full font-bold mb-4;
      color: lightgrey;
      font-size: 16px;
    }
    .main-deck,
    .extra-deck,
    .side-deck {
      @apply w-full border rounded-lg;
      border-color: lightgrey;
      min-height: 208.42px;
      margin: 5px 0 10px;
      padding: 10px;
      .cards-item {
        @apply inline-block align-top;
        padding: 5px;
        width: 10%;
        .item-desc {
          @apply text-xs text-white flex;
          span {
            @apply cursor-help;
          }
        }
        img {
          @apply cursor-pointer;
        }
      }
    }
  }
}
.dialog {
  @apply w-full h-auto flex flex-row justify-center;
  img {
    @apply w-full h-auto;
  }
}
.image-dialog {
  @apply flex items-start;
  width: 90%;
  margin: 0 auto 20px;
  img {
    @apply w-1/3;
  }
  .info {
    @apply w-2/3 flex flex-col ml-4;
    font-size: 16px;
    .name {
      @apply font-bold text-black mb-2;
      font-size: 20px;
    }
  }
}

@media (max-width: 1200px) {
  .deck-detail {
    #deck-list {
      width: 900px;
      .main-deck,
      .extra-deck,
      .side-deck {
        min-height: 153.92px;
        padding: 5px;
        .cards-item {
          padding: 3px;
        }
      }
    }
  }
}

@media (max-width: 900px) {
  .deck-detail {
    #deck-list {
      width: 760px;
      .main-deck,
      .extra-deck,
      .side-deck {
        min-height: 160.06px;
        padding: 5px;
        .cards-item {
          padding: 3px;
          width: 12.5%;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .deck-detail {
    min-height: calc(100vh - 101px);
    .btn-box {
      margin: 25px auto 0;
    }
    #deck-list {
      @apply w-full;
      .title {
        @apply text-base;
      }
      .copyright {
        font-size: 12px;
        padding: 0 5px;
      }
      .main-deck,
      .extra-deck,
      .side-deck {
        min-height: 32.6vw;
        .cards-item {
          padding: 2px;
          width: 20%;
          .item-desc {
            font-size: 10px;
          }
        }
      }
    }
  }
  .image-dialog {
    @apply flex items-start;
    width: 90%;
    margin: 0 auto 20px;
    img {
      @apply w-1/3;
    }
    .info {
      @apply w-2/3 flex flex-col ml-4;
      font-size: 16px;
      .name {
        @apply font-bold text-black mb-2;
        font-size: 20px;
      }
    }
  }
  .image-dialog {
    @apply flex items-start;
    width: 95%;
    margin: 0 0 20px;
    .info {
      font-size: 14px;
      .name {
        @apply font-bold text-black mb-1;
        font-size: 16px;
      }
    }
  }
}
</style>
