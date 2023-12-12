<template>
  <div class="footer-wrapper">
    <div class="text">Copyright © 卡壇 YGO Info. All rights reserved.test1</div>
  </div>
</template>

<style lang="scss" scoped>
.footer-wrapper {
  @apply w-full text-center;
  background-color: #2b2b2b;
  padding: 10px 0;
  & .text {
    color: lightgray;
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
