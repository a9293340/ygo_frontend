<template>
  <div class="login-pop-wrapper">
    <el-icon class="cross" @click="closeLogin"><Close /></el-icon>
    <div class="form-container">
      <!-- 會員登入 type=0 -->
      <template v-if="type === 0">
        <div class="title">{{ t('user.login_title') }}</div>
        <form action="">
          <input
            class="input"
            v-model="loginForm.account"
            type="text"
            :placeholder="t('user.account')"
            autocomplete="username"
          />
          <input
            class="input"
            v-model="loginForm.password"
            :type="isShowPsd ? 'text' : 'password'"
            :placeholder="t('user.password')"
            autocomplete="current-password"
          />
          <div class="checkbox" tabindex="0">
            <label class="cursor-pointer">
              <input v-model="isShowPsd" type="checkbox" tabindex="-1" />
              {{ $t('user.show_password') }}
            </label>
          </div>
        </form>
        <div class="captcha">
          <input
            class="captcha-input"
            v-model="captcha"
            type="text"
            :placeholder="t('user.captcha')"
            @keyup.enter.native="handleLogin"
          />
          <Captcha ref="captchaRef" @getCaptcha="captchaCode = $event" />
        </div>
        <button class="btn" @click="handleLogin">{{ t('user.login') }}</button>
      </template>

      <!-- 忘記密碼 type=1 -->
      <template v-if="type === 1">
        <div class="title">{{ t('user.forget') }}</div>
        <form action="">
          <input
            class="input"
            v-model="forgetForm.email"
            type="text"
            :placeholder="t('user.email')"
          />
          <input
            class="input"
            v-model="forgetForm.account"
            type="text"
            :placeholder="t('user.account')"
            autocomplete="username"
          />
        </form>
        <div class="captcha">
          <input
            class="captcha-input"
            v-model="captcha"
            type="text"
            :placeholder="t('user.captcha')"
            @keyup.enter.native="handleVerify"
          />
          <Captcha ref="captchaRef" @getCaptcha="captchaCode = $event" />
        </div>
        <button class="btn" @click="handleVerify">
          {{ t('user.verify') }}
        </button>
      </template>

      <!-- 註冊帳號 type=2 -->
      <template v-if="type === 2">
        <div class="title">{{ t('user.register') }}</div>
        <form action="">
          <input
            class="input"
            v-model="registerForm.name"
            type="text"
            :placeholder="t('user.name')"
          />
          <input
            class="input"
            v-model="registerForm.email"
            type="text"
            :placeholder="t('user.email')"
          />
          <input
            class="input"
            v-model="registerForm.account"
            type="text"
            :placeholder="t('user.account')"
            autocomplete="username"
          />
          <input
            class="input"
            v-model="registerForm.password"
            :type="isShowPsd ? 'text' : 'password'"
            :placeholder="t('user.password')"
            autocomplete="new-password"
          />
          <input
            class="input"
            v-model="confirmPsd"
            :type="isShowPsd ? 'text' : 'password'"
            :placeholder="t('user.confirm_psd')"
            autocomplete="new-password"
          />
          <div class="checkbox" tabindex="0">
            <label class="cursor-pointer">
              <input v-model="isShowPsd" type="checkbox" tabindex="-1" />
              {{ $t('user.show_password') }}
            </label>
          </div>
        </form>
        <div class="captcha">
          <input
            class="captcha-input"
            v-model="captcha"
            type="text"
            :placeholder="t('user.captcha')"
            @keyup.enter.native="handleRegister"
          />
          <Captcha ref="captchaRef" @getCaptcha="captchaCode = $event" />
        </div>
        <button class="btn"
                :class="{'unable-to-click':isCounting || registerLoading}"
                :disabled="isCounting"
                @click="handleRegister"
        >
          <span v-if="registerLoading" class="loader"></span>
          <span v-else>{{ t('user.sign_up') }}</span>
        </button>
        <button v-if="isShowResend"
                class="btn-resend"
                :class="{'unable-to-click':isCounting}"
                :disabled="isCounting"
                @click="handleResendVerify"
        >
          {{ t('user.resend_mail') }}
          <span v-if="isCounting">{{ `(${remainingTime}${t('user.second')})` }}</span>
        </button>
      </template>

      <!-- 填寫新密碼 type=3 -->
      <template v-if="type === 3">
        <div class="title">{{ t('user.new_password') }}</div>
        <form action="">
          <input
            class="input"
            v-model="newPsdForm.old_password"
            :type="isShowPsd ? 'text' : 'password'"
            :placeholder="t('user.password')"
            autocomplete="username"
          />
          <input
            class="input"
            v-model="confirmNewPsd"
            :type="isShowPsd ? 'text' : 'password'"
            :placeholder="t('user.confirm_psd')"
            autocomplete="username"
          />
          <div class="checkbox" tabindex="0">
            <label class="cursor-pointer">
              <input v-model="isShowPsd" type="checkbox" tabindex="-1" />
              {{ $t('user.show_password') }}
            </label>
          </div>
        </form>
        <button class="btn" @click="handleResetPsd">
          {{ t('user.send') }}
        </button>
      </template>

      <div class="other-box">
        <div v-if="type !== 0" @click="changeType(0)">
          {{ t('user.login_title') }}
        </div>
        <div v-if="type !== 1 && type !== 3" @click="changeType(1)">
          {{ t('user.forget') }}
        </div>
        <div v-if="type !== 2" @click="changeType(2)">
          {{ t('user.register') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  LoginType,
  VerifyType,
  ReSendVerifyType,
  MemberAddType,
  ResetPWDType,
} from 'request-data-types';
import i18n from '@/i18n';
const { t } = i18n.global;
import { getNowDate } from '@/util/parseDate';
import { callApi } from '@/util/api';
import type { Token } from 'module-types';
import type { CreateMemberToken } from 'response-data-types';
import { decode, validatePassword } from '@/util';
import { useCommon } from '@/stores/common';
const commonStore = useCommon();

const type = ref<number>(0); // 0=會員登入 1=忘記密碼, 2=建立帳號, 3=填寫新密碼
const changeType = (num: number) => {
  type.value = num;
  resetForm(num);
};
// 清空表單
function resetForm(type: number) {
  isShowPsd.value = false;
  captcha.value = '';
  switch (type) {
    case 0:
      loginForm.value = { account: '', password: '' };
      break;
    case 1:
      forgetForm.value = { account: '', date: getNowDate(), email: '' };
      break;
    case 2:
      registerForm.value = {
        name: '',
        email: '',
        create_date: getNowDate(),
        account: '',
        password: '',
      };
      confirmPsd.value = '';
      isShowResend.value = false;
      stopCountDown();
      break;
    case 3:
      newPsdForm.value = { old_password: '', new_password: '', tokenReq: '' };
      break;
  }
}

const isShowPsd = ref<boolean>(false);
const captchaRef = ref(null);
const captcha = ref<string>('');
const captchaCode = ref<string>('');
// 重置驗證碼
const refreshCaptcha = () => {
  captchaRef.value.refreshCode();
  captcha.value = '';
}
// 會員登入
const loginForm = ref<LoginType>({
  account: '',
  password: '',
});
const handleLogin = async () => {
  if (checkObjNotEmpty(loginForm.value)) {
    // 檢查驗證碼
    if (captcha.value.toUpperCase() !== captchaCode.value) {
      refreshCaptcha();
      alert(t('user.error_captcha'));
      return;
    }
    // call member/login
    const res = await callApi<LoginType>(
      loginForm.value,
      'member',
      'login',
      false
    );
    if (!res.error_code || res.error_code === 10009) {
      alert(t('user.login_good'));
      // 顯示登入圖示，及登入內容
      const token = decode<Token>(res.data);
      commonStore.setAccount(token.token, loginForm.value.account, token.name);
      closeLogin();
    } else {
      alert(
        t(`user.verify_${res.error_code === 10004 ? '11001' : res.error_code}`)
      );
      refreshCaptcha();
    }
  } else {
    alert(t('user.blank_notice'));
  }
};

// 忘記密碼
const forgetForm = ref<VerifyType>({
  account: '',
  date: getNowDate(),
  email: '',
});
const handleVerify = async () => {
  // 檢查驗證碼
  if (captcha.value.toUpperCase() !== captchaCode.value) {
    refreshCaptcha()
    alert(t('user.error_captcha'));
    return;
  }
  if (checkObjNotEmpty(forgetForm.value)) {
    // call member/verify
    const res = await callApi<{ verify_code: VerifyType }>(
      { verify_code: forgetForm.value },
      'member',
      'verify',
      false
    );
    !res.error_code ? changeType(3) : alert(t(`user.verify_${res.error_code}`));refreshCaptcha();
  } else {
    alert(t('user.blank_notice'));
    refreshCaptcha();
  }
};

// 確認表單、密碼
const checkFormat = <T extends { password: string }>(
  target: T,
  confirm: string
) => {
  if (!checkObjNotEmpty(target)) {
    alert(t('user.blank_notice'));
    return false;
  }

  if (!validatePassword(target.password)) {
    alert(t('user.error_password'));
    return false;
  }

  if (registerForm.value.password !== confirm) {
    alert(t('user.psd_different'));
    return false;
  }

  return true;
};

// 註冊帳號
const registerForm = ref<MemberAddType>({
  name: '',
  email: '',
  create_date: getNowDate(),
  account: '',
  password: '',
});
watch(registerForm, (newVal, oldVal) => {
  isShowResend.value = false;
  stopCountDown();
}, { deep: true });
const confirmPsd = ref<string>('');
const registerLoading = ref<boolean>(false);
const handleRegister = async () => {
  registerLoading.value = true
  // check
  if (!checkFormat<MemberAddType>(registerForm.value, confirmPsd.value)) return;
  // call member/add
  const response = await callApi<MemberAddType>(
    registerForm.value,
    'member',
    'add',
    false
  );
  registerLoading.value = false
  if (!response.error_code) {
    const res = decode<CreateMemberToken>(response.data);
    if (res.token) {
      alert(t('user.sign_up_good'));
      isShowResend.value = true
      startCountDown();
    } else alert(t('user.sign_up_bug'));
  } else {
    alert(t(`user.verify_${response.error_code}`));
    if (response.error_code === 11007) {
      // 帳號或 EMAIL 待驗證
      const userConfirmed = confirm(t('user.reSend_verify'));
      if (userConfirmed) {
        // call member/reSend
        const { account, email } = registerForm.value;
        const response = await callApi<ReSendVerifyType>(
            { account, email },
            'member',
            'reSend',
            false
        );
        if (!response.error_code) {
          alert(t('user.reSend_success'));
          closeLogin();
        } else {
          alert(t(`user.verify_${response.error_code}`));
        }
      } else {
        // 執行取消操作
      }
    }
  }
};
// 倒數計時器
const isShowResend = ref<boolean>(false)
const isCounting = ref<boolean>(false)
const remainingTime = ref<number>(60)
let intervalId: number | undefined;
const startCountDown = () => {
  isCounting.value = true
  remainingTime.value = 60
  intervalId = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    } else {
      stopCountDown();
    }
  }, 1000);
}
const stopCountDown = () => {
  if (intervalId !== undefined) {
    clearInterval(intervalId);
    intervalId = undefined;
    isCounting.value = false
  }
}
const handleResendVerify = async () => {
  // call member/reSend
  const { account, email } = registerForm.value;
  const response = await callApi<ReSendVerifyType>(
      { account, email },
      'member',
      'reSend',
      false
  );
  if (!response.error_code) {
    alert(t('user.reSend_success'));
  } else {
    alert(t(`user.verify_${response.error_code}`));
  }
  startCountDown();
}
onBeforeUnmount(() => {
  stopCountDown();
})


// 填寫新密碼
const newPsdForm = ref<ResetPWDType>({
  old_password: '',
  new_password: '',
  tokenReq: '',
});
const confirmNewPsd = ref<string>('');
const handleResetPsd = async () => {
  newPsdForm.value.tokenReq = forgetForm.value.account;
  newPsdForm.value.new_password = confirmNewPsd.value;

  // check
  if (
    !checkFormat({ password: newPsdForm.value.old_password }, confirmPsd.value)
  )
    return;

  // call member/resetPassword
  const res = await callApi<ResetPWDType>(
    newPsdForm.value,
    'member',
    'resetPassword',
    false
  );

  if (!res.error_code) {
    alert(t('user.reset_pwd_good'));
    changeType(0);
  } else {
    alert(t(`user.verify_${res.error_code}`));
  }
};

// 檢查物件內是否有空字串，有則 return false
const checkObjNotEmpty = (obj: { [key: string]: string }): boolean => {
  return Object.values(obj).every(value => value !== '');
};

const emit = defineEmits(['closeLogin']);
const closeLogin = () => {
  emit('closeLogin');
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

.login-pop-wrapper {
  @apply fixed left-0 top-0 z-50 w-full h-full flex justify-center items-center;
  background-color: rgba(0, 0, 0, 0.9);
  & .cross {
    @apply absolute right-0 top-0 text-white cursor-pointer;
    font-size: 35px;
    margin: 13px 20px;
  }
  & .form-container {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px 40px 30px;
    border-radius: 10px;
    width: 400px;
    & .title {
      @apply font-bold text-center;
      font-size: 28px;
      color: #1f2c5d;
    }
    & .input {
      @apply w-full bg-white;
      height: 50px;
      margin: 15px 0 0;
      padding: 0 16px;
      border-radius: 8px;
      border: 2px solid #1f2c5d;
      font-size: 18px;
    }
    & .checkbox {
      @apply cursor-pointer;
      font-size: 16px;
      color: #333333;
      margin: 10px 0 0 5px;
      & input {
        margin: 0 5px 0 0;
      }
    }
    & .captcha {
      @apply flex justify-between items-center;
      margin: 10px 0 0;
      & .captcha-input {
        width: calc(100% - 155px);
      }
    }
    & .btn {
      @apply flex justify-center items-center w-full text-white;
      height: 50px;
      margin: 15px 0 0;
      border-radius: 8px;
      font-size: 18px;
      background-color: #1f2c5d;
      transition-duration: 0.1s;
      &:hover {
        background-color: #2a3d83;
      }
      & .loader {
        border: 3px solid #f3f3f3;
        border-top: 3px solid #5aa8b0;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        animation: spin 2s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    }
    & .btn-resend {
      @apply w-full bg-white;
      height: 50px;
      margin: 10px 0 0;
      border-radius: 8px;
      font-size: 16px;
      border: 2px solid #1f2c5d;
      color: #1f2c5d;
      transition-duration: 0.1s;
      &:hover {
        color: #2a3d83;
      }
    }
    & .unable-to-click {
      @apply cursor-no-drop;
      opacity: 0.5;
    }
    & .unable-to-click.btn {
      &:hover {
        background-color: #1f2c5d;
      }
    }
    & .btn-resend.btn-resend {
      &:hover {
        color: #1f2c5d;
      }
    }
    & .other-box {
      @apply flex justify-center underline;
      & div {
        @apply cursor-pointer;
        margin: 15px 30px 0;
        color: #1f2c5d;
        font-size: 16px;
        transition-duration: 0.1s;
        &:hover {
          color: #2a3d83;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .login-pop-wrapper {
    & .form-container {
      width: 90vw;
      padding: 20px 25px 25px;
      & .title {
        font-size: 22px;
      }
      & .input {
        height: 40px;
        margin: 12px 0 0;
        padding: 0 10px;
        border-radius: 4px;
        border: 2px solid #1f2c5d;
        font-size: 16px;
      }
      & .btn {
        height: 40px;
        border-radius: 4px;
        font-size: 16px;
      }
      & .btn-resend {
        height: 40px;
        margin: 10px 0 0;
        border-radius: 4px;
        font-size: 14px;
      }
    }
  }
}
</style>
