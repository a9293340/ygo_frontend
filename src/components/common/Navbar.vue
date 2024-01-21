<template>
  <div class="nav-wrapper">
    <el-icon class="expand-icon" @click="isExpand = !isExpand">
      <Expand v-if="!isExpand" />
      <Fold v-else />
    </el-icon>
    <router-link to="/">
      <img src="/src/assets/img/logo.png" alt="" />
    </router-link>
    <div class="nav-right">
      <div v-if="!isLogin" class="login-btn" @click="isShowLogin = true">
        <el-icon class="login-icon"><Avatar /></el-icon>
      </div>
      <div v-else class="user-name" @click="isShowLogout = true">
        <span class="pc">Hi,</span>
        {{ ` ${commonStore.account_name}` }}
      </div>
    </div>
  </div>
  <div class="nav-height"></div>

  <transition name="slide">
    <Sideboard v-if="isExpand" @closeSideboard="isExpand=false" />
  </transition>

  <transition name="fade">
    <LoginPop v-if="isShowLogin" @close-login="isShowLogin=false" />
  </transition>

  <transition name="fade">
    <LogoutPop v-if="isShowLogout" @close-logout="isShowLogout=false" />
  </transition>
</template>

<script setup lang="ts">
import { useCommon } from '@/stores/common';
const commonStore = useCommon();

const isExpand = ref<boolean>(false);
const isShowLogin = ref<boolean>(false);
const isShowLogout = ref<boolean>(false);

const isLogin = ref<string>(commonStore.account_id)
watch(() => commonStore.account_id, () => {
  isLogin.value = commonStore.account_id;
});
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
  color: lightgrey;
  background-color: #2b2b2b;
  padding: 0 20px;
  & .expand-icon {
    @apply text-white cursor-pointer justify-start;
    font-size: 30px;
    width: 140px;
    transition: 0.2s;
    &:hover {
      color: #dbdbdb;
    }
  }
  & img {
    height: 40px;
  }
  & .nav-right {
    @apply flex justify-end items-center h-full;
    width: 140px;
    & .login-btn {
      @apply flex justify-center items-center text-white cursor-pointer;
      border: 2px solid white;
      width: 35px;
      height: 35px;
      border-radius: 999px;
      transition: 0.2s;
      &:hover {
        border: 2px solid #dbdbdb;
        color: #dbdbdb;
      }
      & .login-icon {
        font-size: 22px;
        margin: 0 0 3px;
      }
    }
    & .user-name {
      @apply w-full text-center truncate cursor-pointer;
      padding: 10px 5px;
      border-radius: 5px;
      transition-duration: 0.1s;
      &:hover {
        background-color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}
.nav-height {
  height: 60px;
}

@media (max-width: 768px) {
  .nav-wrapper {
    padding: 0 10px;
    & .expand-icon {
      width: 90px;
    }
    & .nav-right {
      width: 90px;
      & .user-name {
        padding: 15px 0;
        font-size: 14px;
        &:hover {
          background: none;
        }
      }
    }
  }
}
</style>
