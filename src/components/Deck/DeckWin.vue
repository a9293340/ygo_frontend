<script setup lang="ts">
// @ts-ignore
import type { CardsList, Cards, Deck } from 'module-types';
import type { DeckAddAndEditType, DeckListType } from 'request-data-types';
import type { DeckList } from 'module-types';
import type { HasTotalRes } from 'response-data-types';
import { useIntersection } from '@/composables/useIntersection';
import type { ComponentPublicInstance } from 'vue';
import { extraType } from '@/config/ygo';
import { VueDraggable, type UseDraggableReturn } from 'vue-draggable-plus';
import { useDeckStore } from '@/stores/deck';
import i18n from '@/i18n/index';
import { generateRandomString } from '@/util/index';
import { callApi } from '@/util/api';
import { decode } from '@/util';

const { t } = i18n.global;
const { pick_deck_id } = storeToRefs(useDeckStore());

interface DeckCardsListProps {
  cardsList: CardsList | [];
  trigger: number;
  total: number;
}

type DeckType = {
  card_id: string;
  card_rarity: string;
  card_number: string;
  card_num_id: string;
};

const route = useRoute();
const router = useRouter();
const emit = defineEmits(['call:api']);
const drag = ref<UseDraggableReturn>();
const mainDeckLens = ref(60);
const pickIndex = ref(0);
const dialogDisable = ref(false);
const imageDisable = ref(false);
const onLargeTarget = ref<Cards>();

const { intersectionObserver, isIntersection } = useIntersection();
const loadingRef = ref<ComponentPublicInstance<HTMLElement>>();
const isShowLoading = computed(() => total.value !== cardsList.value.length);
const props = withDefaults(defineProps<DeckCardsListProps>(), {
  cardsList: () => [],
  trigger: 0,
  total: 0,
});
const cardsList = computed(() => props.cardsList);
const trigger = computed(() => props.trigger);
const total = computed(() => props.total);
const cardsListRarity = computed(
  () => cardsList.value.map((item: Cards) => item.rarity[0]) as string[],
);
// Deck
const deckDetail = ref<Deck>();
const mainDeckOrigin = ref<CardsList>([]);
const mainDeck = ref<DeckContent[]>([]);

const extraDeckOrigin = ref<CardsList>([]);
const extraDeck = ref<DeckContent[]>([]);

const sideDeckOrigin = ref<CardsList>([]);
const sideDeck = ref<DeckContent[]>([]);

// save
const deck_name = ref('');
const deck_id = ref('');

watch(trigger, () => {
  const cardListElement: HTMLElement = document.querySelector('.card-list');
  cardListElement.scrollTop = 0;
});

watch(isIntersection, newVal => {
  if (newVal) emit('call:api');
});

const calculateCount = (cardDeckItem: DeckType) => {
  const allData: DeckContent[] = [...mainDeck.value, ...extraDeck.value, ...sideDeck.value];
  let count = 0;
  for (let i = 0; i < allData.length; i++) {
    const data = allData[i];
    if (data.card_number === cardDeckItem.card_number) count++;

    if (count >= 3) break;
  }

  return count;
};

const addCardToDeck = (idx: number) => {
  // console.log(idx);
  const card = cardsList.value[idx];
  const isExtra = extraType.findIndex(item => item === card.type) !== -1;

  const deckItem = {
    card_id: card._id,
    card_num_id: card.id,
    card_number: card.number,
    card_rarity: cardsListRarity.value[idx],
  };

  if (calculateCount(deckItem) >= 3) return;

  if (isExtra && extraDeck.value.length < 15) extraDeck.value.push(deckItem);

  if (!isExtra && mainDeck.value.length < mainDeckLens.value) mainDeck.value.push(deckItem);
  else if (!isExtra && sideDeck.value.length < 15) sideDeck.value.push(deckItem);
};

const removeDeck = (type: string, idx: number) => {
  switch (type) {
    case 'm':
      mainDeck.value.splice(idx, 1);
      break;
    case 'e':
      extraDeck.value.splice(idx, 1);
      break;
    case 's':
      sideDeck.value.splice(idx, 1);
      break;
  }
};

const deckEnd = (evt: any) => {
  // if (evt.to.classList[0] === 'main-drag') evt.item.style.height = 'calc(45% - 2px)';
  // else evt.item.style.height = 'calc(90% - 2px)';
  const fromClass = evt.from.classList[0] as string;
  const toClass = evt.to.classList[0] as string;
  const targetCardIndex = evt.oldIndex as number;
  const targetCard =
    fromClass === 'main-drag'
      ? mainDeck.value[targetCardIndex]
      : fromClass === 'extra-drag'
        ? extraDeck.value[targetCardIndex]
        : sideDeck.value[targetCardIndex];

  // 長度防呆
  if (toClass === 'main-drag' && mainDeckOrigin.value.length >= mainDeckLens.value) return;
  if (toClass === 'side-drag' && sideDeckOrigin.value.length >= 15) return;
  if (toClass === 'extra-drag' && extraDeckOrigin.value.length >= 15) return;

  // main to extra
  if (fromClass === 'main-drag' && toClass === 'extra-drag') {
    extraDeck.value.splice(evt.newIndex, 1);
    return;
  }

  // extra to main
  if (fromClass === 'extra-drag' && toClass === 'main-drag') {
    mainDeck.value.splice(evt.newIndex, 1);
    return;
  }

  // 其他

  switch (fromClass) {
    case 'main-drag':
      mainDeck.value.splice(evt.oldIndex, 1);
      break;
    case 'extra-drag':
      extraDeck.value.splice(evt.oldIndex, 1);
      break;
    case 'side-drag':
      sideDeck.value.splice(evt.oldIndex, 1);
      break;
  }

  switch (toClass) {
    case 'main-drag':
      mainDeck.value.splice(evt.newIndex, 0, targetCard);
      break;
    case 'extra-drag':
      extraDeck.value.splice(evt.newIndex, 0, targetCard);
      break;
    case 'side-drag':
      sideDeck.value.splice(evt.newIndex, 0, targetCard);
      break;
  }
};

const onEnd = (evt: any) => {
  evt.item.style.width = '100%';
  evt.item.children[1].style.display = 'flex';
  evt.item.style.display = 'flex';
  const toClass = evt.to.classList[0] as string;
  pickIndex.value = evt.item.dataset.idx as number;
  const cardItem = cardsList.value[pickIndex.value] as Cards;
  const cardDeckItem = {
    card_id: cardItem._id,
    card_number: cardItem.number,
    card_rarity: cardsListRarity.value[pickIndex.value],
    card_num_id: cardItem.id,
  } as DeckType;

  // 長度防呆
  if (toClass === 'main-drag' && mainDeckOrigin.value.length >= mainDeckLens.value) return;
  if (toClass === 'side-drag' && sideDeckOrigin.value.length >= 15) return;
  if (toClass === 'extra-drag' && extraDeckOrigin.value.length >= 15) return;

  // 數量防呆
  if (calculateCount(cardDeckItem) >= 3) return;

  // Extra 移動到 Main 防呆
  // const toClassIsExtra = toClass === "extra-drag";
  const isExtra = extraType.findIndex(item => item === cardItem.type) !== -1;
  if (isExtra && toClass === 'main-drag') {
    if (toClass === 'main-drag') mainDeckOrigin.value.splice(evt.newIndex, 1);
    else sideDeckOrigin.value.splice(evt.newIndex, 1);

    if (extraDeck.value.length < 15) extraDeck.value.push(cardDeckItem);

    return;
  }

  // Main 移動到 Extra 防呆
  if (!isExtra && toClass === 'extra-drag') {
    extraDeckOrigin.value.splice(evt.newIndex, 1);
    if (mainDeck.value.length < mainDeckLens.value) mainDeck.value.push(cardDeckItem);
    else if (sideDeck.value.length < 15) sideDeck.value.push(cardDeckItem);

    return;
  }

  // 其他
  switch (toClass) {
    case 'main-drag':
      mainDeck.value.splice(evt.newIndex, 0, cardDeckItem);
      break;
    case 'extra-drag':
      extraDeck.value.splice(evt.newIndex, 0, cardDeckItem);
      break;
    case 'side-drag':
      sideDeck.value.splice(evt.newIndex, 0, cardDeckItem);
      break;
  }
};

const onDeckStart = (evt: any) => {
  // evt.dragged.style.height = 'calc(45% - 2px)';
};

const onStart = (evt: any) => {
  evt.dragged.style.width = '80px';
  evt.dragged.children[1].style.display = 'none';
  evt.dragged.style.display = 'inline-block';
};

// tool
const triggerImage = (i: number) => {
  onLargeTarget.value = cardsList.value[i];
  imageDisable.value = true;
};

const reset = () => {
  mainDeckOrigin.value = [];
  mainDeck.value = [];
  extraDeckOrigin.value = [];
  extraDeck.value = [];
  sideDeck.value = [];
  sideDeckOrigin.value = [];
};

const saveDeck = () => {
  // if (mainDeck.value.length + extraDeck.value.length + sideDeck.value.length < 15) return;

  // 新增
  if (pick_deck_id.value === '') {
    dialogDisable.value = true;
    deck_id.value = generateRandomString(14);
  } else editDeck();
};

const editDeck = async () => {
  const deck: Deck = {
    _id: deckDetail.value._id,
    admin_id: deckDetail.value.admin_id,
    title: deckDetail.value.title,
    create_date: deckDetail.value.create_date,
    last_edit_date: new Date().toLocaleDateString(),
    main_deck: mainDeck.value.map(item => ({
      card_id: item.card_id,
      card_rarity: item.card_rarity,
    })),
    extra_deck: extraDeck.value.map(item => ({
      card_id: item.card_id,
      card_rarity: item.card_rarity,
    })),
    side_deck: sideDeck.value.map(item => ({
      card_id: item.card_id,
      card_rarity: item.card_rarity,
    })),
  };
  const res = await callApi<DeckAddAndEditType>(deck, 'deck', 'edit', false);
  console.log(res);

  if (!res.error_code) {
    dialogDisable.value = false;
    pick_deck_id.value = '';
    reset();
    router.push('/deck');
  } else {
    // 失敗邏輯
  }
};

const addDeck = async () => {
  if (deck_name.value === '' || deck_id.value === '') return;
  const deck: Deck = {
    admin_id: deck_id.value,
    title: deck_name.value,
    create_date: new Date().toLocaleDateString(),
    last_edit_date: new Date().toLocaleDateString(),
    main_deck: mainDeck.value.map(item => ({
      card_id: item.card_id,
      card_rarity: item.card_rarity,
    })),
    extra_deck: extraDeck.value.map(item => ({
      card_id: item.card_id,
      card_rarity: item.card_rarity,
    })),
    side_deck: sideDeck.value.map(item => ({
      card_id: item.card_id,
      card_rarity: item.card_rarity,
    })),
  };

  const res = await callApi<DeckAddAndEditType>(deck, 'deck', 'add', false);
  if (!res.error_code) {
    dialogDisable.value = false;
    pick_deck_id.value = '';
    reset();
    router.push('/deck');
  } else {
    // 失敗邏輯
  }
};

const getDeckDetail = async () => {
  deckDetail.value = decode<HasTotalRes<DeckList>>(
    (
      await callApi<DeckListType>(
        {
          page: 0,
          limit: 1,
          filter: {
            admin_id: pick_deck_id.value,
          },
        },
        'deck',
        'deckList',
        false,
      )
    ).data,
  ).list[0];

  mainDeck.value = deckDetail.value.main_deck;
  extraDeck.value = deckDetail.value.extra_deck;
  sideDeck.value = deckDetail.value.side_deck;
};

onMounted(async () => {
  intersectionObserver(loadingRef.value?.$el);

  if (pick_deck_id.value !== '') {
    await getDeckDetail();
    await router.replace({
      query: {
        deck_admin_id: pick_deck_id.value,
      },
    });
  }
  console.log(route.query);
  if (route.query.deck_admin_id) {
    pick_deck_id.value = route.query.deck_admin_id as string;
    await getDeckDetail();
  }
});
</script>

<template>
  <div class="deck-win-component">
    <div class="card-list scroll">
      <VueDraggable
        ref="drag"
        v-model="cardsList"
        :group="{ name: 'cards', pull: 'clone', put: false }"
        :animation="150"
        :sort="false"
        ghostClass="ghost"
        @end="onEnd"
        @move="onStart"
      >
        <div v-if="cardsList.length === 0" class="no-data">{{ $t('deck.no_data') }}</div>
        <div
          class="card-info-list"
          :data-idx="i"
          v-for="(item, i) in cardsList"
          @dblclick="addCardToDeck(i)"
        >
          <img class="card-img" :src="`/api/card-image/cards/${item?.number}.webp`" alt="" />
          <div class="card-info">
            <div class="name">{{ item.name }}</div>
            <div>{{ item.id }}</div>
            <div>
              {{ item.star }}{{ item.star && ' / ' }}{{ item.attribute }}{{ item.attribute && ' / '
              }}{{ item.type }}
            </div>
            <div class="atk" v-if="item.atk && item.def">
              <span>ATK: {{ item.atk }}</span>
              <span>DEF: {{ item.atk }}</span>
            </div>
            <div class="rarity">
              <select v-model="cardsListRarity[i]">
                <option v-for="(rarity, index) in item.rarity" :value="rarity" :key="index">
                  {{ rarity }}
                </option>
              </select>
            </div>
            <!-- <div class="btn">
							<el-button type="primary">加入</el-button>
						</div> -->
          </div>
          <el-icon class="card-detail-btn" @click.stop="triggerImage(i)"><InfoFilled /></el-icon>
        </div>
      </VueDraggable>
      <Loading ref="loadingRef" v-show="isShowLoading" />
    </div>
    <div class="deck-contents scroll">
      <!-- tool button -->
      <div class="btn-box">
        <button @click="reset">{{ t('deck.reset') }}</button>
        <button @click="saveDeck">{{ t('deck.save') }}</button>
      </div>
      <!-- main -->
      <div class="title">{{ t('deck.main_deck') }}({{ mainDeck.length }}/{{ mainDeckLens }})</div>
      <div class="main-deck">
        <VueDraggable
          ref="drag"
          v-model="mainDeckOrigin"
          :group="{ name: 'cards', pull: 'clone' }"
          :animation="150"
          ghostClass="ghost"
          class="main-drag"
          @end="deckEnd"
          @move="onDeckStart"
          data-type="m"
        >
          <div v-for="(item, i) in mainDeck" :key="item.card_id" class="main-drag-item text-white">
            <div class="item-desc">
              <el-tooltip effect="dark" :content="item.card_num_id" placement="top">
                <span>{{ item.card_rarity }}</span>
              </el-tooltip>
              <el-icon size="18" class="cursor-pointer" @click="removeDeck('m', i)">
                <CloseBold />
              </el-icon>
            </div>
            <img :src="`/api/card-image/cards/${item?.card_number}.webp`" alt="" />
          </div>
        </VueDraggable>
      </div>
      <!-- extra -->
      <div class="title">{{ t('deck.extra_deck') }}({{ extraDeck.length }}/15)</div>
      <div class="main-deck extra-deck">
        <VueDraggable
          ref="drag"
          v-model="extraDeckOrigin"
          :group="{ name: 'cards', pull: 'clone' }"
          :animation="150"
          ghostClass="ghost"
          class="extra-drag"
          @end="deckEnd"
          @move="onDeckStart"
          data-type="e"
        >
          <div
            v-for="(item, i) in extraDeck"
            :key="item.card_id"
            class="extra-drag-item text-white"
          >
            <div class="item-desc">
              <el-tooltip effect="dark" :content="item.card_num_id" placement="top">
                <span>{{ item.card_rarity }}</span>
              </el-tooltip>
              <el-icon size="20" class="cursor-pointer" @click="removeDeck('e', i)">
                <CloseBold />
              </el-icon>
            </div>
            <img :src="`/api/card-image/cards/${item?.card_number}.webp`" alt="" />
          </div>
        </VueDraggable>
      </div>
      <!-- side -->
      <div class="title">{{ t('deck.side_deck') }}({{ sideDeck.length }}/15)</div>
      <div class="main-deck side-deck">
        <VueDraggable
          ref="drag"
          v-model="sideDeckOrigin"
          :group="{ name: 'cards', pull: 'clone' }"
          :animation="150"
          ghostClass="ghost"
          class="side-drag"
          @end="deckEnd"
          @move="onDeckStart"
          data-type="s"
        >
          <div v-for="(item, i) in sideDeck" :key="item.card_id" class="side-drag-item text-white">
            <div class="item-desc">
              <el-tooltip effect="dark" :content="item.card_num_id" placement="top">
                <span>{{ item.card_rarity }}</span>
              </el-tooltip>
              <el-icon size="20" class="cursor-pointer" @click="removeDeck('s', i)">
                <CloseBold />
              </el-icon>
            </div>
            <img :src="`/api/card-image/cards/${item?.card_number}.webp`" alt="" />
          </div>
        </VueDraggable>
      </div>
    </div>
  </div>

  <el-dialog v-model="imageDisable">
    <div class="image-dialog">
      <img :src="`/api/card-image/cards/${onLargeTarget?.number}.webp`" alt="" />
      <div class="info">
        <div class="name">{{ onLargeTarget?.name }} ({{ onLargeTarget?.id }})</div>
        <div>{{ t('card.rarity') }} : {{ onLargeTarget?.rarity.join('、') }}</div>
        <div>
          {{ t('card.attribute') }} : {{ onLargeTarget?.attribute }} / {{ t('card.type') }} :
          {{ onLargeTarget?.type }}
        </div>
        <div v-if="onLargeTarget?.race">
          {{ t('card.race') }} : {{ onLargeTarget?.race }} / {{ t('card.star') }} :
          {{ onLargeTarget?.star }}
        </div>
        <div v-if="onLargeTarget?.atk">
          {{ t('card.atk') }} : {{ onLargeTarget?.atk }} / {{ t('card.def') }} :
          {{ onLargeTarget?.def }}
        </div>
        <div class="effect" v-html="onLargeTarget?.effect"></div>
      </div>
    </div>
  </el-dialog>

  <el-dialog v-model="dialogDisable" :title="t('deck.input_info')" width="600px">
    <div class="deck-dialog">
      <el-form-item class="deck-form" :label="t('deck.set_name')">
        <el-input class="deck-input" v-model="deck_name" />
      </el-form-item>
      <el-form-item class="deck-form" :label="t('deck.set_id')">
        <el-input class="deck-input" v-model="deck_id" :readonly="true" />
      </el-form-item>
      <el-button class="save-btn" type="success" @click="addDeck">{{ t('deck.save') }}</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.deck-input.el-input {
  @apply w-48;
  .el-input__inner {
    @apply w-48;
  }
}
.deck-form.el-form-item {
  label {
    @apply w-72 flex flex-row justify-start;
  }
}
</style>

<style lang="scss" scoped>
.deck-win-component {
  @apply flex justify-between;
  width: 1200px;
  margin: 20px auto;
  .no-data {
    @apply text-center;
    font-size: 16px;
    margin: 10px 0 0;
  }
  .card-list {
    @apply overflow-x-hidden;
    color: #d3d3d3;
    font-size: 16px;
    width: 323px;
    height: calc(100vh - 104px - 180px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 5px;
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
    }
    .card-info-list {
      @apply flex items-start box-border mb-4 cursor-move;
      .card-img {
        width: 100px;
      }
      .card-info {
        @apply flex flex-col pl-2;
        width: 190px;
        .name {
          @apply w-full font-bold;
          font-size: 18px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .atk {
          span {
            &:first-child {
              margin: 0 10px 0 0;
            }
          }
        }
        .rarity {
          margin: 5px 0 0 -2px;
          select {
            padding: 3px 8px;
            border-radius: 5px;
            width: 130px;
            background-color: transparent;
            color: lightgray;
          }
        }
      }
      .card-detail-btn {
        @apply cursor-pointer;
        font-size: 24px;
        margin: 2px 0 0;
        transition-duration: 0.2s;
        &:hover {
          @apply text-white;
        }
      }
    }
  }
  .deck-contents {
    @apply h-full flex flex-col;
    width: 870px;
    height: calc(100vh - 104px - 180px);
    padding: 0 5px 5px;
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
    }
    .btn-box {
      @apply flex justify-end;
      button {
        background-color: #1f2c5d;
        font-size: 16px;
        color: lightgray;
        border: 1px solid lightgray;
        border-radius: 5px;
        width: 90px;
        height: 30px;
        margin: 0 0 0 10px;
        transition-duration: 0.2s;
        &:hover {
          @apply text-white;
          border: 1px solid white;
        }
      }
    }
    .title {
      @apply text-white text-lg font-extrabold;
    }
    .main-deck {
      @apply w-full border-white border rounded-lg;
      min-height: 282.38px;
      .main-drag,
      .extra-drag,
      .side-drag {
        @apply w-full h-full p-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-rounded-xl scrollbar-thumb-rounded-xl scrollbar-thumb-blue-700 scrollbar-track-slate-200;
        font-size: 0;
        .main-drag-item,
        .extra-drag-item,
        .side-drag-item {
          @apply inline-block box-border text-center align-top;
          width: 74.5px;
          margin: 2px 5px;
          .item-desc {
            @apply items-center text-xs text-white flex flex-row justify-between;
            span {
              @apply cursor-help;
            }
          }
          img {
            @apply w-full cursor-move;
          }
        }
      }
    }
    .extra-deck {
      min-height: 152.19px;
    }
    .side-deck {
      min-height: 152.19px;
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
    .effect {
      @apply whitespace-pre-wrap text-justify mt-4;
    }
  }
}
.deck-dialog {
  @apply flex flex-col justify-center;
  width: 90%;
  margin: 0 auto;
  & .save-btn {
    @apply self-end mt-2;
    width: 100px;
  }
}
</style>
