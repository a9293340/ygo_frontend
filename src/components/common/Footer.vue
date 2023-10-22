<template>
  <div class="footer-wrapper">
    <div class="text">
      Copyright ©  卡壇 YGO Info. All rights reserved.
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-wrapper {
  @apply w-full text-center text-white;
  background-color: #2B2B2B;
  padding: 10px 0;
  & .text {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .footer-wrapper {
    padding: 10px;
    & .text {
      font-size: 14px;
    }
  }
}
</style>
