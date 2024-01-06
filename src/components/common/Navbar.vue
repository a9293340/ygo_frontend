<template>
  <div class="nav-wrapper">
    <el-icon class="expand-icon" @click="isExpand = !isExpand">
      <Expand v-if="!isExpand" />
      <Fold v-else />
    </el-icon>
    <router-link to="/">
      <img src="/src/assets/img/logo.png" alt="" />
    </router-link>
    <div class="login-btn" @click="isShowLogin = true">
      <el-icon class="login-icon"><Avatar /></el-icon>
    </div>
  </div>
  <div class="nav-height"></div>

  <transition name="slide">
    <Sideboard v-if="isExpand" @closeSideboard="isExpand=false" />
  </transition>

  <transition name="fade">
    <LoginPop v-if="isShowLogin" @close-login="isShowLogin=false" />
  </transition>
</template>

<script setup lang="ts">
const isExpand = ref<boolean>(false);
const isShowLogin = ref<boolean>(false);

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
      color: #dbdbdb;
    }
  }
  & img {
    height: 40px;
  }
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
}
.nav-height {
  height: 60px;
}

@media (max-width: 768px) {
  .nav-wrapper {
    & .login-btn {
      width: 30px;
      height: 30px;
      & .login-icon {
        font-size: 20px;
        margin: 0 0 2px;
      }
    }
  }
}
</style>
