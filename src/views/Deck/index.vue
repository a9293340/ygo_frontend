<template>
  <div class="deck-list">
    <div class="search-bar">
      <div class="item-box">
        <div class="item-title">{{ t("deck.deck_title") }}</div>
        <input
            v-model="listQuery.filter.title"
            type="text"
            :placeholder="t('deck.input_title')"
        />
      </div>
      <div class="item-box">
        <div class="item-title">{{ t("deck.deck_id") }}</div>
        <input
            v-model="listQuery.filter.admin_id"
            type="text"
            :placeholder="t('deck.input_id')"
        />
      </div>
      <div class="item-box">
        <div class="item-title">{{ t("deck.deck_time") }}</div>
        <el-date-picker
            v-model="date"
            type="daterange"
            :range-separator="t('deck.to')"
            :start-placeholder="t('deck.time_start')"
            :end-placeholder="t('deck.time_end')"
        />
      </div>
      <button
          class="search-btn"
          @click="getList({ limit: listQuery.limit, page: 0 })"
      >{{ t("card.search") }}</button
      >
    </div>
    <div class="list-container">
      <div class="deck-info-box">
        <div class="deck-info-title">
          <div class="lg-item">{{ t("deck.deck_name") }}</div>
          <div class=sm-item>{{ t("deck.deck_time_create") }}</div>
          <div class="sm-item">{{ t("deck.deck_time_edit") }}</div>
          <div class="action-item"></div>
        </div>
        <div
            class="deck-info"
            :class="{ 'chosen-deck': chosenCard === item.title }"
            v-for="(item, i) in deckList"
            :key="item.title"
            @click.stop="chosenCard = item.title ? item.title : ''"
        >
          <div class="lg-item">{{ item.title }}</div>
          <div class="sm-item">{{ formatDateString(item.create_date) }}</div>
          <div class="sm-item">{{ formatDateString(item.last_edit_date) }}</div>
          <div class="action-item">
            <el-button type="warning" @click="openDialog('e', i)">{{
                t("deck.edit")
              }}</el-button>
            <el-button type="danger" @click="openDialog('r', i)">{{
                t("deck.remove")
              }}</el-button>
            <el-button type="primary" @click="goToDetail(item._id)">{{
                t("deck.detail")
              }}</el-button>
          </div>
        </div>
      </div>
    </div>

    <Pagination
        :hidden="total <= 0"
        :total="total"
        :limit="listQuery.limit"
        :page.sync="listQuery.page"
        @pagination="getList"
    />
  </div>
  <!-- remove dialog -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form-item class="deck-form" :label="t('deck.deck_check')">
      <el-input class="deck-input" v-model="deck_check_id" />
    </el-form-item>
    <el-button
        style="width: 100px"
        type="danger"
        v-if="removeVisible"
        @click="removeDeck"
    >{{ t("deck.remove") }}</el-button
    >
    <el-button
        style="width: 100px"
        type="warning"
        v-if="editVisible"
        @click="editDeck"
    >{{ t("deck.edit") }}</el-button
    >
  </el-dialog>
</template>

<script setup lang="ts">
import type { HasTotalRes } from "response-data-types";
import type { DeckListType, DeckDeleteType } from "request-data-types";
import type { PaginationGetList } from "common-types";
import type { DeckList } from "module-types";
import { formatDateString } from "@/util/parseDate"
import { decode, removeNullAndEmptyString } from "@/util";
import { callApi } from "@/util/api";
import i18n from "@/i18n/index";
import { useRoute, useRouter } from "vue-router";
import { useDeckStore } from "@/stores/deck";

const { t } = i18n.global;
const route = useRoute();
const router = useRouter();
const { pick_deck_id } = storeToRefs(useDeckStore());

const deckList = ref<DeckList>([]);
const chosenCard = ref("");
const total = ref(0);
const date = ref("");
const removeVisible = ref(false);
const editVisible = ref(false);
const dialogTitle = ref("");
const dialogVisible = ref(false);
const nowPickTarget = ref(0);
const deck_check_id = ref("");

const listQuery = ref<DeckListType>({
	page: 0,
	limit: 20,
	filter: {
		admin_id: "",
		title: "",
		begin_date: "",
		end_date: "",
	},
});

const getList = async (val: PaginationGetList) => {
  console.log(date.value)
	if (date.value !== "") {
		listQuery.value.filter.begin_date = new Date(date.value[0]).toDateString();
		listQuery.value.filter.end_date = new Date(date.value[1]).toDateString();
	}
	listQuery.value.page = val.page;

	const data = decode<HasTotalRes<DeckList>>(
		(
			await callApi<DeckListType>(
				removeNullAndEmptyString(listQuery.value),
				"deck",
				"deckList",
				false
			)
		).data
	);
	deckList.value = data.list;
	total.value = data.total;
	await router.replace({
		query: removeNullAndEmptyString(listQuery.value.filter),
	});
	console.log(deckList.value);
};

watch(dialogVisible, (newVal) => {
	if (!newVal) {
		removeVisible.value = false;
		editVisible.value = false;
	}
});

const removeDeck = async () => {
	const target_id = deckList.value.find(
		(el) => el.admin_id === deck_check_id.value
	);
	if (target_id) {
		try {
			const data = await callApi<DeckDeleteType>(
				{ _id: target_id._id },
				"deck",
				"delete",
				false
			);
		} catch (error) {}

		await getList({ limit: listQuery.value.limit, page: 0 });
		dialogVisible.value = false;
	}
};

const editDeck = () => {
	const target_id = deckList.value.find(
		(el) => el.admin_id === deck_check_id.value
	);
	if (target_id) {
		pick_deck_id.value = target_id.admin_id;
		router.push("/deck/add");
	}
};

const goToDetail = (_id) => {
	router.push(`/deck/${_id}`);
};

const openDialog = (type: string, idx: number) => {
	if (type === "r") {
		removeVisible.value = true;
		dialogTitle.value = t("deck.remove");
	} else {
		editVisible.value = true;
		dialogTitle.value = t("deck.edit");
	}
	nowPickTarget.value = idx;
	dialogVisible.value = true;
};

onMounted(async () => {
	listQuery.value.filter = { ...listQuery.value.filter, ...route.query };
	await getList({ limit: listQuery.value.limit, page: 0 });
});
</script>

<style lang="scss" scoped>
.deck-list {
	min-height: calc(100vh - 104px);
  padding: 0 0 30px;
	& .search-bar {
		@apply flex justify-center;
    width: 1150px;
    margin: 0 auto;
    padding: 40px 0 20px;
		& .item-box {
      font-size: 16px;
      margin: 0 5px 10px;
      & .item-title {
        color: lightgray;
        margin: 0 0 3px;
      }
      & input {
        @apply bg-white;
        color: #606266;
        padding: 5px 11px;
        border-radius: 5px;
        width: 200px;
        &::placeholder {
          color: #aBabb2;
        }
      }
		}
    :deep(.el-date-editor) {
      height: 36px;
      border-radius: 5px;
      .el-range-input {
        font-size: 16px;
      }
    }
    & .search-btn {
      @apply self-end;
      color: lightgray;
      border: 1px solid lightgray;
      border-radius: 5px;
      width: 120px;
      height: 36px;
      margin: 10px 5px 10px;
      transition-duration: 0.2s;
      &:hover {
        @apply text-white;
        border: 1px solid white;
      }
    }
	}
	& .list-container {
    width: 80vw;
		min-width: 1150px;
		margin: 10px auto 30px;
		& .deck-info-box {
			@apply w-full flex flex-col;
			& .deck-info-title,
			& .deck-info {
				@apply flex w-full;
				color: lightgray;
				font-size: 16px;
				background-color: rgba(31, 44, 93, 0.6);
				& div {
					@apply flex flex-wrap justify-center items-center text-center;
					border: 1px solid lightgray;
					width: 130px;
					padding: 10px 0;
				}
				& .sm-item {
					width: 150px;
				}
				& .lg-item {
					@apply grow;
				}
        & .action-item {
          width: 250px;
        }
			}
			& .deck-info-title {
				background-color: #333333;
			}
			& .deck-info {
				@apply cursor-pointer;
				transition-duration: 0.2s;
				&:hover {
					background-color: rgba(31, 44, 93, 0.3);
				}
			}
			& .chosen-deck {
				background-color: rgba(31, 44, 93, 0.3);
			}
		}
	}
}

@media (max-width: 1200px) {
	.deck-list {
    & .search-bar {
      width: 900px;
    }
		& .list-container {
			width: 95vw;
			min-width: unset;
      & .deck-info-box {
        & .deck-info-title,
        & .deck-info {
          & .sm-item {
            width: 120px;
          }
          & .action-item {
            width: 230px;
          }
        }
      }
		}
	}
}

@media (max-width: 900px) {
	.deck-list {
    & .search-bar {
      width: 760px;
      & .item-box {
        & input {
          width: 150px;
        }
      }
      :deep(.el-date-editor) {
        width: 300px;
      }
      & .search-btn {
        width: 100px;
      }
    }
    & .list-container {
      width: 95vw;
      min-width: unset;
      overflow-y: scroll;
      & .deck-info-box {
        min-width: 800px;
      }
    }
	}
}

@media (max-width: 768px) {
	.deck-list {
		min-height: calc(100vh - 101px);
    & .search-bar {
      @apply w-full flex flex-wrap justify-center;
      padding: 40px 0 20px;
      & .item-box {
        & input {
          width: 45vw;
        }
      }
      :deep(.el-date-editor) {
        width: 70vw;
      }
      & .search-btn {
        width: 20vw;
      }
    }
	}
}
</style>
