<template>
  <div class="banner-wrapper">
    <div class="carousel">
      <el-icon
          class="arrow arrow-left"
          @click="myCarousel.prev()"
      ><ArrowLeftBold /></el-icon>
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
          <div class="img pc"
               :class="{'has-link': item.url}"
               :style="{backgroundImage: 'url(' + item.photo_pc + ')'}"
               @click="openLink(item.url)"
          ></div>
          <div class="img mobile"
               :style="{backgroundImage: 'url(' + item.photo_mobile + ')'}"
               @click="openLink(item.url)"
          ></div>
        </Slide>
        <template #addons>
          <Pagination class="pc"/>
        </template>
      </Carousel>
      <el-icon
          class="arrow arrow-right"
          @click="myCarousel.next()"
      ><ArrowRightBold /></el-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Carousel, Pagination, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import type { BannerList } from 'module-types'

const nowIndex = ref<number>(0)
const myCarousel = ref<any>(null)
const bannerList = ref<BannerList>([
  {
    _id: '1',
    title: '1',
    subtitle: '1',
    date: '2023/02/13',
    photo_pc: 'https://picsum.photos/600/200',
    photo_mobile: 'https://picsum.photos/300/200',
    url: ''
  },
  {
    _id: '2',
    title: '2',
    subtitle: '2',
    date: '2023/02/14',
    photo_pc: 'https://picsum.photos/450/150',
    photo_mobile: 'https://picsum.photos/450/300',
    url: ''
  },
  {
    _id: '3',
    title: '3',
    subtitle: '3',
    date: '2023/02/15',
    photo_pc: 'https://picsum.photos/1200/400',
    photo_mobile: 'https://picsum.photos/600/400',
    url: 'https://ucamc.com/262-%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8javascript%E9%80%A3%E7%B5%90%E8%BD%89%E8%B7%B3%E7%B6%B2%E5%9D%80%E6%96%B9%E6%B3%95'
  }
])

const openLink = (url) => {
  if (url) window.open(url)
}
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
      padding: 4vw 0;
      & .img {
        @apply bg-no-repeat bg-cover bg-center;
        width: 75vw;
        height: 25vw;
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
          height: 28vw;
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
