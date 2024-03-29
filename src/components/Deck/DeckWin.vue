<script setup lang="ts">
// @ts-ignore
import type { CardsList, Cards, Deck, forbiddenCardList } from 'module-types';
import type { DeckAddAndEditType, DeckListType } from 'request-data-types';
import type { DeckList } from 'module-types';
import type { HasTotalRes } from 'response-data-types';
import { useIntersection } from '@/composables/useIntersection';
import type { ComponentPublicInstance } from 'vue';
import { extraType, ceremony, manaType } from '@/config/ygo';
import { VueDraggable, type UseDraggableReturn } from 'vue-draggable-plus';
import { useDeckStore } from '@/stores/deck';
import i18n from '@/i18n/index';
import { callApi } from '@/util/api';
import { decode } from '@/util';
import { useCommon } from '@/stores/common';
import forbidden_0 from '@/assets/img/forbiddenCardList_0.png';
import forbidden_1 from '@/assets/img/forbiddenCardList_1.png';
import forbidden_2 from '@/assets/img/forbiddenCardList_2.png';

const { t } = i18n.global;
const { pick_deck_id, isCopy, searchCardsId } = storeToRefs(useDeckStore());
const { account_id } = storeToRefs(useCommon());

interface DeckCardsListProps {
  cardsList: CardsList | [];
  trigger: number;
  total: number;
  forbiddenCardList: forbiddenCardList;
}

type DeckType = {
  card_id: string;
  card_rarity: string;
  card_number: string;
  card_num_id: string;
  card_type?: string;
  card_star?: string;
  card_name: string;
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
const imgs = ref([forbidden_0, forbidden_1, forbidden_2]);

const { intersectionObserver, isIntersection } = useIntersection();
const loadingRef = ref<ComponentPublicInstance<HTMLElement>>();
const isShowLoading = computed(() => total.value !== cardsList.value.length);
const props = withDefaults(defineProps<DeckCardsListProps>(), {
  cardsList: () => [],
  forbiddenCardList: () => [],
  trigger: 0,
  total: 0,
});
const cardsList = computed(() => props.cardsList);
const trigger = computed(() => props.trigger);
const total = computed(() => props.total);
const cardsListRarity = computed(
  () => cardsList.value.map((item: Cards) => item.rarity[0]) as string[]
);
// Deck
const deckDetail = ref<Deck>({
  _id: '',
  admin_id: account_id.value,
  title: '',
  create_date: new Date().toLocaleDateString(),
  last_edit_date: new Date().toLocaleDateString(),
  main_deck: [],
  extra_deck: [],
  side_deck: [],
});
const mainDeckOrigin = ref<CardsList>([]);
const mainDeck = ref<DeckContent[]>([]);

const extraDeckOrigin = ref<CardsList>([]);
const extraDeck = ref<DeckContent[]>([]);

const sideDeckOrigin = ref<CardsList>([]);
const sideDeck = ref<DeckContent[]>([]);

watch(trigger, () => {
  const cardListElement: HTMLElement = document.querySelector('.card-list');
  cardListElement.scrollTop = 0;
});

watch(isIntersection, newVal => {
  if (newVal) emit('call:api');
});

watch(
  () => route.query,
  async (newVal, oldVal) => {
    if (newVal.deck_admin_id) {
      if (oldVal.deck_admin_id && oldVal.deck_admin_id === newVal.deck_admin_id)
        return;
      pick_deck_id.value = route.query.deck_admin_id as string;
      await getDeckDetail();
    } else if (oldVal.deck_admin_id && !newVal.deck_admin_id) {
      pick_deck_id.value = '';
      deckDetail.value = {
        _id: '',
        admin_id: account_id.value,
        title: deckDetail.value.title,
        create_date: new Date().toLocaleDateString(),
        last_edit_date: new Date().toLocaleDateString(),
        main_deck: [],
        extra_deck: [],
        side_deck: [],
      };
      reset();
    }
  }
);

const calculateCount = (cardDeckItem: DeckType) => {
  const allData: DeckContent[] = [
    ...mainDeck.value,
    ...extraDeck.value,
    ...sideDeck.value,
  ];
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
    card_type: card.type,
  } as DeckType;
  if (card.star) deckItem.card_star = card.star;

  if (calculateCount(deckItem) >= 3) return;

  if (isExtra && extraDeck.value.length < 15) extraDeck.value.push(deckItem);

  if (!isExtra && mainDeck.value.length < mainDeckLens.value)
    mainDeck.value.push(deckItem);
  else if (!isExtra && sideDeck.value.length < 15)
    sideDeck.value.push(deckItem);
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
  if (
    toClass === 'main-drag' &&
    mainDeckOrigin.value.length >= mainDeckLens.value
  )
    return;
  if (toClass === 'side-drag' && sideDeckOrigin.value.length >= 15) return;
  if (toClass === 'extra-drag' && extraDeckOrigin.value.length >= 15) return;

  // main to extra
  if (
    (fromClass === 'main-drag' || fromClass === 'side-drag') &&
    toClass === 'extra-drag'
  ) {
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
  evt.item.children[0].children[0].style.display = 'block';
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
    card_type: cardItem.type,
  } as DeckType;

  if (cardItem.star) cardDeckItem.card_star = cardItem.star;
  // 長度防呆
  if (
    toClass === 'main-drag' &&
    mainDeckOrigin.value.length >= mainDeckLens.value
  )
    return;
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
    if (mainDeck.value.length < mainDeckLens.value)
      mainDeck.value.push(cardDeckItem);
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
  evt.dragged.children[0].children[0].style.display = 'none';
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
  isCopy.value = false;
};

const saveDeck = () => {
  if (
    mainDeck.value.length + extraDeck.value.length + sideDeck.value.length <
    1
  )
    return;

  // 新增
  if (pick_deck_id.value === '' || isCopy.value) addDeck();
  else editDeck();
};

const editDeck = async () => {
  const deck: Deck = {
    _id: deckDetail.value._id,
    admin_id: account_id.value,
    title: deckDetail.value.title,
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

  const res = await callApi<DeckAddAndEditType>(deck, 'deck', 'edit', false);

  if (!res.error_code) {
    dialogDisable.value = false;
    pick_deck_id.value = '';
    reset();
    await router.push(`/deck/mydeck?admin_id=${account_id.value}`);
  } else {
    // 失敗邏輯
  }
};

const addDeck = async () => {
  if (deckDetail.value.title === '') return;
  const deck: Deck = {
    admin_id: account_id.value,
    title: deckDetail.value.title,
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
            _id: pick_deck_id.value,
          },
        },
        'deck',
        'deckList',
        false
      )
    ).data
  ).list[0];

  mainDeck.value = deckDetail.value.main_deck;
  extraDeck.value = deckDetail.value.extra_deck;
  sideDeck.value = deckDetail.value.side_deck;
  // console.log(deckDetail.value.main_deck);
};

const randomSort = () => {
  const shuffleArray = (array: DeckContent[]): DeckContent[] => {
    let currentIndex = array.length;
    let temporaryValue: DeckContent;
    let randomIndex: number;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  mainDeck.value = shuffleArray([...mainDeck.value]);
  sideDeck.value = shuffleArray([...sideDeck.value]);
  extraDeck.value = shuffleArray([...extraDeck.value]);
};

const orderSort = () => {
  const sortByStar = (a: DeckContent, b: DeckContent) => {
    const starA = parseInt(a.card_star.substring(2));
    const starB = parseInt(b.card_star.substring(2));

    return starA - starB;
  };

  const mackMainSort = (deck: DeckContent[]) => {
    const sortByType = (a: DeckContent, b: DeckContent) => {
      const typeIndexA = manaType.indexOf(a.card_type);
      const typeIndexB = manaType.indexOf(b.card_type);
      return typeIndexA - typeIndexB;
    };
    let firstArr = deck
      .filter(
        el =>
          el.card_type !== ceremony && !manaType.find(x => x === el.card_type)
      )
      .sort(sortByStar);
    let secondArr = deck
      .filter(el => el.card_type === ceremony)
      .sort(sortByStar);
    let thirdArr = deck
      .filter(el => manaType.find(x => x === el.card_type))
      .sort(sortByType);

    return [...firstArr, ...secondArr, ...thirdArr];
  };
  const mackExtraSort = (deck: DeckContent[]) => {
    const group = deck.reduce((groups, card) => {
      const p = extraType.find(t => t === card.card_type);
      groups[p] = groups[p] || [];
      groups[p].push(card);
      return groups;
    }, {});
    let arr = [];

    for (let i = 0; i < extraType.length; i++) {
      const ext = extraType[i];
      if (group[ext]) {
        arr = [...arr, ...group[ext].sort(sortByStar)];
      }
    }
    return arr;
  };
  mainDeck.value = mackMainSort([...mainDeck.value]);
  sideDeck.value = mackMainSort([...sideDeck.value]);
  extraDeck.value = mackExtraSort([...extraDeck.value]);
};

const getCardInfo = (item: DeckContent) => {
  searchCardsId.value = item.card_num_id;
};

onMounted(async () => {
  if (!account_id.value) {
    await router.push('/');
    return;
  }
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
        <div v-if="cardsList.length === 0" class="no-data">
          {{ t('deck.no_data') }}
        </div>
        <div
          class="card-info-list"
          :data-idx="i"
          v-for="(item, i) in cardsList"
          :key="item._id"
          @dblclick="addCardToDeck(i)"
        >
          <div class="relative">
            <img
              v-if="forbiddenCardList.find(x => x.number === item?.number)"
              :src="
                imgs[
                  forbiddenCardList.find(x => x.number === item?.number).type
                ]
              "
              class="forbidden-card"
            />
            <img
              class="card-img"
              :src="`/api/card-image/cards/${item?.number}.webp`"
              alt=""
            />
          </div>
          <div class="card-info">
            <div class="name">{{ item.name }}</div>
            <div>{{ item.id }}</div>
            <div>
              {{ item.star }}{{ item.star && ' / ' }}{{ item.attribute
              }}{{ item.attribute && ' / ' }}{{ item.type }}
            </div>
            <div class="atk" v-if="item.atk && item.def">
              <span>ATK: {{ item.atk }}</span>
              <span>DEF: {{ item.atk }}</span>
            </div>
            <div class="rarity">
              <select v-model="cardsListRarity[i]">
                <option
                  v-for="(rarity, index) in item.rarity"
                  :value="rarity"
                  :key="index"
                  style="color: black"
                >
                  {{ rarity }}
                </option>
              </select>
            </div>
            <!-- <div class="btn">
							<el-button type="primary">加入</el-button>
						</div> -->
          </div>
          <el-icon class="card-detail-btn" @click.stop="triggerImage(i)"
            ><InfoFilled
          /></el-icon>
        </div>
      </VueDraggable>
      <Loading ref="loadingRef" v-show="isShowLoading" />
    </div>
    <div class="deck-contents scroll">
      <!-- tool button -->
      <div class="btn-box">
        <div class="title-input">
          <span>{{ t('deck.title') }}</span>
          <input v-model="deckDetail.title" />
        </div>
        <div>
          <button @click="orderSort">{{ t('deck.sort') }}</button>
          <button @click="randomSort">{{ t('deck.random') }}</button>
          <button @click="reset">{{ t('deck.reset') }}</button>
          <button @click="saveDeck">{{ t('deck.save') }}</button>
        </div>
      </div>
      <!-- main -->
      <div class="title">
        {{ t('deck.main_deck') }}({{ mainDeck.length }}/{{ mainDeckLens }})
      </div>
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
          <div
            v-for="(item, i) in mainDeck"
            :key="item.card_id + i"
            class="main-drag-item text-white"
            @dblclick="getCardInfo(item)"
          >
            <div class="item-desc">
              <el-tooltip
                effect="dark"
                :content="item.card_num_id"
                placement="top"
              >
                <span>{{ item.card_rarity }}</span>
              </el-tooltip>
              <el-icon
                size="16"
                class="cursor-pointer"
                @click="removeDeck('m', i)"
              >
                <CloseBold />
              </el-icon>
            </div>
            <div class="img-box">
              <img
                v-if="
                  forbiddenCardList.find(x => x.number === item?.card_number)
                "
                :src="
                  imgs[
                    forbiddenCardList.find(x => x.number === item?.card_number)
                      .type
                  ]
                "
                class="forbidden-img"
                alt=""
              />
              <img
                class="card-img"
                :src="`/api/card-image/cards/${item?.card_number}.webp`"
                alt=""
              />
            </div>
          </div>
        </VueDraggable>
      </div>
      <!-- extra -->
      <div class="title">
        {{ t('deck.extra_deck') }}({{ extraDeck.length }}/15)
      </div>
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
            :key="item.card_id + i"
            class="extra-drag-item text-white"
            @dblclick="getCardInfo(item)"
          >
            <div class="item-desc">
              <el-tooltip
                effect="dark"
                :content="item.card_num_id"
                placement="top"
              >
                <span>{{ item.card_rarity }}</span>
              </el-tooltip>
              <el-icon
                size="16"
                class="cursor-pointer"
                @click="removeDeck('e', i)"
              >
                <CloseBold />
              </el-icon>
            </div>
            <div class="img-box">
              <img
                v-if="
                  forbiddenCardList.find(x => x.number === item?.card_number)
                "
                :src="
                  imgs[
                    forbiddenCardList.find(x => x.number === item?.card_number)
                      .type
                  ]
                "
                class="forbidden-img"
                alt=""
              />
              <img
                class="card-img"
                :src="`/api/card-image/cards/${item?.card_number}.webp`"
                alt=""
              />
            </div>
          </div>
        </VueDraggable>
      </div>
      <!-- side -->
      <div class="title">
        {{ t('deck.side_deck') }}({{ sideDeck.length }}/15)
      </div>
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
          <div
            v-for="(item, i) in sideDeck"
            :key="item.card_id + i"
            class="side-drag-item text-white"
            @dblclick="getCardInfo(item)"
          >
            <div class="item-desc">
              <el-tooltip
                effect="dark"
                :content="item.card_num_id"
                placement="top"
              >
                <span>{{ item.card_rarity }}</span>
              </el-tooltip>
              <el-icon
                size="16"
                class="cursor-pointer"
                @click="removeDeck('s', i)"
              >
                <CloseBold />
              </el-icon>
            </div>
            <div class="img-box">
              <img
                v-if="
                  forbiddenCardList.find(x => x.number === item?.card_number)
                "
                :src="
                  imgs[
                    forbiddenCardList.find(x => x.number === item?.card_number)
                      .type
                  ]
                "
                class="forbidden-img"
                alt=""
              />
              <img
                class="card-img"
                :src="`/api/card-image/cards/${item?.card_number}.webp`"
                alt=""
              />
            </div>
          </div>
        </VueDraggable>
      </div>
    </div>
  </div>

  <el-dialog v-model="imageDisable">
    <div class="image-dialog">
      <img
        :src="`/api/card-image/cards/${onLargeTarget?.number}.webp`"
        alt=""
      />
      <div class="info">
        <div class="name">
          {{ onLargeTarget?.name }} ({{ onLargeTarget?.id }})
        </div>
        <div>
          {{ t('card.rarity') }} : {{ onLargeTarget?.rarity.join('、') }}
        </div>
        <div>
          {{ t('card.attribute') }} : {{ onLargeTarget?.attribute }} /
          {{ t('card.type') }} :
          {{ onLargeTarget?.type }}
        </div>
        <div v-if="onLargeTarget?.race">
          {{ t('card.race') }} : {{ onLargeTarget?.race }} /
          {{ t('card.star') }} :
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
      @apply flex items-start box-border mb-4 cursor-move relative;
      .card-img {
        width: 100px;
      }
      .forbidden-card {
        @apply absolute;
        width: 25px;
        top: -5px;
        left: -5px;
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
            border: 1px solid rgba(211, 211, 211, 0.5);
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
      @apply flex justify-between mb-1 text-white;
      .title-input {
        input {
          @apply ml-3;
          color: white;
          background-color: #1f2c5d;
          border-radius: 3px;
          width: 170px;
          height: 30px;
          padding: 0 5px;
        }
      }
      button {
        background-color: #1f2c5d;
        font-size: 15px;
        color: lightgray;
        border: 1px solid lightgray;
        border-radius: 5px;
        width: 80px;
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
      padding: 10px;
      .main-drag,
      .extra-drag,
      .side-drag {
        .main-drag-item,
        .extra-drag-item,
        .side-drag-item {
          @apply inline-block align-bottom;
          padding: 5px;
          width: 10%;
          .item-desc {
            @apply items-center text-xs text-white flex flex-row justify-between;
            span {
              @apply cursor-help;
            }
          }
          .img-box {
            @apply relative;
            .card-img {
              @apply cursor-move;
              margin: 2px 0 0;
            }
            .forbidden-img {
              @apply absolute;
              top: -2px;
              left: -5px;
              width: 20px;
            }
          }
        }
      }
      .main-drag {
        min-height: 273.97px;
      }
      .extra-drag,
      .side-drag {
        min-height: 134.98px;
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
    .effect {
      @apply whitespace-pre-wrap text-justify mt-4;
    }
  }
}
.deck-dialog {
  @apply flex flex-col justify-center;
  width: 90%;
  margin: 0 auto;
  .button-list {
    @apply flex flex-row justify-end;
    & .save-btn {
      @apply text-white self-end mt-2 ml-2;
      width: 100px;
      height: 35px;
      border-radius: 5px;
      background-color: #1f2c5d;
      transition-duration: 0.2s;
      &:hover {
        background-color: #2a3d83;
      }
    }
  }
}

@media (max-width: 1200px) {
  .deck-win-component {
    width: 100vw;
    padding: 0 10px;
    .deck-contents {
      width: calc(100vw - 350px);
      .main-deck {
        .main-drag,
        .extra-drag,
        .side-drag {
          .main-drag-item,
          .extra-drag-item,
          .side-drag-item {
            width: 12.5%;
          }
        }
        .main-drag {
          min-height: 26.55vw;
        }
        .extra-drag,
        .side-drag {
          min-height: 13.28vw;
        }
      }
    }
  }
}

@media (max-width: 1000px) {
  .deck-win-component {
    width: 100vw;
    padding: 0 10px;
    .deck-contents {
      width: calc(100vw - 350px);
      .btn-box {
        @apply flex flex-col items-center;
        button {
          margin: 10px 10px 0 0;
        }
      }
      .main-deck {
        .main-drag,
        .extra-drag,
        .side-drag {
          .main-drag-item,
          .extra-drag-item,
          .side-drag-item {
            width: 16.66%;
            .item-desc {
              font-size: 9px;
            }
          }
        }
        .main-drag {
          min-height: 27.13vw;
        }
        .extra-drag,
        .side-drag {
          min-height: 13.58vw;
        }
      }
    }
  }
}
</style>
