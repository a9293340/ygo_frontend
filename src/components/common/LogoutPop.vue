<template>
  <div class="logout-pop-wrapper">
    <el-icon class="cross" @click="closeLogout"><Close /></el-icon>
    <div class="form-container">
      <div class="text">{{ t('user.logout_notice') }}</div>
      <img src="/src/assets/img/logout.png" alt="">
      <button class="logout-btn" @click="handleLogout">{{ t('user.logout') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import i18n from "@/i18n/index";
const { t } = i18n.global;
import { useCommon } from '@/stores/common';
const commonStore = useCommon();

const handleLogout = () => {
  commonStore.clearAccount()
  alert(t('user.logout_good'))
  closeLogout()
}

const emit = defineEmits(['closeLogout']);
const closeLogout = () => {
  emit('closeLogout');
};
</script>

<style lang="scss" scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.1s;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.logout-pop-wrapper {
  @apply fixed left-0 top-0 z-50 w-full h-full flex justify-center items-center;
  background-color: rgba(0, 0, 0, 0.9);
  & .cross {
    @apply absolute right-0 top-0 text-white cursor-pointer;
    font-size: 35px;
    margin: 13px 20px;
  }
  & .form-container {
    @apply flex flex-col items-center;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px 40px 30px;
    border-radius: 10px;
    width: 300px;
    & .text {
      font-size: 24px;
      color: #333333;
    }
    & img {
      width: 90px;
      margin: 15px 0 25px;
    }
    & .logout-btn {
      @apply text-white;
      width: 130px;
      height: 35px;
      border-radius: 8px;
      font-size: 16px;
      background-color: #1f2c5d;
      transition-duration: 0.2s;
      &:hover {
        background-color: #2a3d83;
      }
    }
  }
}

@media (max-width: 480px) {
  .logout-pop-wrapper {
    & .form-container {
      & .text {
        font-size: 22px;
      }
      & .logout-btn {
        &:hover {
          background-color: #1f2c5d;
        }
      }
    }
  }
}
</style>
