<template>
  <div class="nav-wrapper">
    <el-icon class="expand-icon" @click="isExpand = !isExpand">
      <Expand v-if="!isExpand" />
      <Fold v-else />
    </el-icon>
    <router-link to="/">
      <img src="/src/assets/img/logo.png" alt="" />
    </router-link>
    <div style="width: 30px">註冊</div>
    <!-- <div style="width: 30px" @click="signIn">註冊</div> -->
  </div>
  <div class="nav-height"></div>
  <transition name="slide">
    <Sideboard v-if="isExpand" @closeSideboard="isExpand = false" />
  </transition>
</template>

<script setup lang="ts">
import { callApi } from '@/util/api';
import type { AdminList, Admin } from 'module-types';
import type { NotHasTotalRes, CreateMemberToken } from 'response-data-types';
import type { MemberAddType } from 'request-data-types';

import { decode } from '@/util';

const isExpand = ref<boolean>(false);

// const signIn = async () => {
//   const temp: Admin = {
//     name: 'user.name',
//     account: 'user.account',
//     create_date: 'user.create_date',
//     password: 'user.password',
//     email: 'f102041332@gmail.com',
//     photo: 'user.photo',
//     status: 1,
//     type: 2,
//   };
//   const token = decode<NotHasTotalRes<CreateMemberToken>>(
//     (await callApi<MemberAddType>(temp, 'member', 'add', false)).data,
//   );
//   console.log(token);
// };
</script>

<style lang="scss" scoped>
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-50%);
  opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s;
}
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.nav-wrapper {
  @apply flex justify-between items-center fixed top-0 left-0 w-full z-30;
  height: 60px;
  background-color: #2b2b2b;
  padding: 0 20px;
  & .expand-icon {
    @apply text-white cursor-pointer;
    font-size: 30px;
    transition: 0.2s;
    &:hover {
      color: #b4b4b4;
    }
  }
  & img {
    height: 40px;
  }
}
.nav-height {
  height: 60px;
}
</style>
