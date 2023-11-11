<template>
	<div class="banner-wrapper">
		<div class="carousel">
			<el-icon class="arrow arrow-left" @click="myCarousel.prev()">
        <ArrowLeftBold/>
      </el-icon>
			<Carousel
				class="carousel-container"
				:itemsToShow="1"
				:wrapAround="true"
				:transition="500"
				ref="myCarousel"
				tabindex="-1"
				v-model="nowIndex"
			>
				<Slide v-for="item in bannerList" :key="item._id">
					<div
						class="img pc"
						:class="{ 'has-link': item.url }"
						:style="{
							backgroundImage:
								'url(' + '/api/card-image/banner/' + item.photo_pc + ')',
						}"
						@click="openLink(item.url)"
					></div>
					<div
						class="img mobile"
						:style="{
							backgroundImage:
								'url(' + '/api/card-image/banner/' + item.photo_mobile + ')',
						}"
						@click="openLink(item.url)"
					></div>
				</Slide>
				<template #addons>
					<Pagination class="pc" />
				</template>
			</Carousel>
			<el-icon class="arrow arrow-right" @click="myCarousel.next()"
				><ArrowRightBold
			/></el-icon>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Carousel, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import type { BannerList } from "module-types";
import { callApi } from "@/util/api";
import { decode } from "@/util/index";
import type { NotHasTotalRes } from "response-data-types";

const nowIndex = ref<number>(0);
const myCarousel = ref<any>(null);
const bannerList = ref<BannerList | null>(null);

const openLink = (url: string | undefined) => {
	if (url) window.open(url);
};

onMounted(async () => {
	const list = (await callApi<object>({}, "banner", "list", false)).data;
	bannerList.value = decode<NotHasTotalRes<BannerList>>(list).list;
	// console.log(bannerList.value);
});
</script>

<style lang="scss" scoped>
.banner-wrapper {
	background-color: #181818;
	& .carousel {
		@apply flex relative justify-center items-center;
		& .arrow {
			@apply text-white cursor-pointer;
			font-size: 3vw;
			transition-duration: 0.2s;
			margin: 1vw;
			&:hover {
				color: rgba(255, 255, 255, 0.8);
			}
		}
		& .carousel-container {
			width: 75vw;
      max-width: 1000px;
			padding: 2vw 0 4vw;
			& .img {
				@apply bg-no-repeat bg-cover bg-center;
				width: 75vw;
				height: 35vw;
        max-width: 1000px;
        max-height: 466.67px;
			}
			& .has-link {
				@apply cursor-pointer;
			}
			:deep(.carousel__pagination) {
				@apply w-full absolute;
				bottom: 1.5vw;
				.carousel__pagination-item {
					.carousel__pagination-button {
						&::after {
							border-radius: 0.205vw;
							width: 2vw;
							height: 0.41vw;
							background-color: #abafb4;
						}
					}
					.carousel__pagination-button--active {
						&::after {
							@apply bg-white;
							width: 2vw;
							height: 0.41vw;
						}
					}
				}
			}
		}
	}
}

@media (max-width: 1050px) {
	.banner-wrapper {
		& .carousel {
			& .arrow {
				font-size: 3.5vw;
				margin: 1.5vw;
			}
			& .carousel-container {
				width: 84vw;
				& .img {
					width: 84vw;
					height: 39.2vw;
				}
				:deep(.carousel__pagination) {
					.carousel__pagination-item {
						.carousel__pagination-button {
							&::after {
								width: 3vw;
								height: 0.5vw;
							}
						}
						.carousel__pagination-button--active {
							&::after {
								width: 3vw;
								height: 0.5vw;
							}
						}
					}
				}
			}
		}
	}
}

@media (max-width: 768px) {
	.banner-wrapper {
		& .carousel {
			@apply flex relative justify-center items-center;
			& .arrow {
				font-size: 8vw;
			}
			& .arrow-left {
				@apply absolute left-0 z-10;
			}
			& .arrow-right {
				@apply absolute right-0;
			}
			& .carousel-container {
				width: 100vw;
				padding: 4vw 0;
				& .img {
					@apply bg-no-repeat bg-cover bg-center;
					width: 100vw;
					height: 66.67vw;
				}
			}
		}
	}
}
</style>
