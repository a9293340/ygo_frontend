<template>
  <div class="captcha-wrapper">
    <button type="button" @click.prevent="refreshCode">
      <canvas id="auth-code" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineExpose } from 'vue'

const emit = defineEmits(['getCaptcha', 'refreshCode']);

const captcha = ref<string>('');
// 隨機數字
const randomNum = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};
// 隨機顏色
const randomColor = (min: number, max: number): string => {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return `rgb(${r},${g},${b})`;
};
// 隨機驗證碼
const randomCode = (): string => {
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    const txt = str[randomNum(0, str.length)];
    code += txt;
  }
  emit('getCaptcha', code);
  captcha.value = code;
  return code;
};
// 刷新驗證碼
const refreshCode = () => {
  writeAuthCode();
};
defineExpose({
  refreshCode,
});

const writeAuthCode = () => {
  const options = {
    canvasId: 'auth-code',
    txt: randomCode(), // 傳入驗證碼內容
    height: 40,
    width: 140,
  };
  const canvas = document.getElementById(options.canvasId) as HTMLCanvasElement;
  if (canvas) {
    canvas.width = options.width;
    canvas.height = options.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'middle'
      // 這個範圍的顏色作背景看起來清晰一些
      ctx.fillStyle = randomColor(180, 255)
      ctx.fillRect(0, 0, options.width, options.height)
      for (let i = 0; i < options.txt.length; i++) {
        // 讓每個字不一樣
        const txt = options.txt.charAt(i)
        ctx.font = '2.5em SimHei'
        // 隨機生成字型顏色
        ctx.fillStyle = randomColor(50, 160)
        ctx.shadowOffsetY = randomNum(-3, 3)
        ctx.shadowBlur = randomNum(-3, 3)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
        const x = options.width / (options.txt.length + 1) * (i + 1)
        const y = options.height / 2
        const deg = randomNum(-30, 30)
        // 設定旋轉角度和座標原點
        ctx.translate(x, y)
        ctx.rotate(deg * Math.PI / 180)
        ctx.fillText(txt, 0, 0)
        // 恢復旋轉角度和座標原點
        ctx.rotate(-deg * Math.PI / 180)
        ctx.translate(-x, -y)
      }
      // 1~4條隨機干擾線隨機出現
      for (let i = 0; i < randomNum(1, 4); i++) {
        ctx.strokeStyle = randomColor(40, 180)
        ctx.beginPath()
        ctx.moveTo(randomNum(0, options.width), randomNum(0, options.height))
        ctx.lineTo(randomNum(0, options.width), randomNum(0, options.height))
        ctx.stroke()
      }
      // 繪製干擾點
      for (let i = 0; i < options.width / 6; i++) {
        ctx.fillStyle = randomColor(0, 255)
        ctx.beginPath()
        ctx.arc(randomNum(0, options.width), randomNum(0, options.height), 1, 0, 2 * Math.PI)
        ctx.fill()
      }
    }
  }
}

onMounted(() => {
  writeAuthCode();
  emit('refreshCode', refreshCode);
})
</script>

<style lang="scss" scoped>
.captcha-wrapper {
  width: 140px;
  height: 40px;
}
</style>
