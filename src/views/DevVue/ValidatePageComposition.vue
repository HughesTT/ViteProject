<template>
  <div class="container pb-5">
    <h3>Validate</h3>
    <div class="row mt-4">
      <div class="col-4">
        <div class="mb-3">
          <button @click.prevent="updateLanguage('zh_TW')" class="btn btn-success mr-2" type="button">zh_TW</button>
          <button @click.prevent="updateLanguage('en')" class="btn btn-danger mr-2" type="button">EN</button>
        </div>
        <Form ref="form" class="form" @submit="onFormSubmit" v-slot="{ values, errors }">
          Error: {{ errors }} <br />
          Values: {{ values }} <br /><br />
          <div class="mb-3">
            <label for="username" class="form-label">username</label>
            <Field name="username" id="username" placeholder="your name" rules="required" type="text"
              class="form-control" />
            <ErrorMessage name="username" class="error-message" />
          </div>
          <div class="mb-3">
            <label for="" class="form-label">email</label>
            <Field name="email" id="email" placeholder="your Email" rules="required|email" class="form-control" />
            <ErrorMessage name="email" class="error-message" />
          </div>
          <div class="mb-3">
            <label for="country" class="form-label">country</label>
            <Field name="country" id="country" placeholder="input country" as="select" rules="required"
              class="form-select">
              <option value="" disabled>select country</option>
              <option v-for="country in countries" :key="country.value" :value="country.value">
                {{ country.name }}
              </option>
            </Field>
            <ErrorMessage name="country" class="error-message" />
          </div>
          <div class="mb-3">
            <label for="phone" class="form-label">phone</label>
            <Field name="phone" id="phone" placeholder="phone number" :rules="{ required: true, phone: values.country }"
              class="form-control" />
            <ErrorMessage name="phone" class="error-message" />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <div class="input-group">
              <Field :type="showPassword ? 'text' : 'password'" name="password" id="password" placeholder="password"
                rules="required|min:8" class="form-control" />
              <button type="button" class="btn btn-outline-secondary" @click="togglePassword">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <ErrorMessage name="password" class="error-message" />
          </div>
          <div class="mb-3 form-check">
            <Field name="check" id="check" type="checkbox" :value="true" :unchecked-value="false" rules="accepted"
              class="form-check-input" />
            <label class="form-check-label" for="check">I agree to the terms and conditions</label><br />
            <ErrorMessage name="check" class="error-message" />
          </div>
          <button class="btn btn-secondary">Sign up</button>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate';
import { required, email, min } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import en from '@vee-validate/i18n/dist/locale/en.json'
import zh_TW from '@vee-validate/i18n/dist/locale/zh_TW.json'
import { ref } from 'vue';

// 定義使用的規則
defineRule('required', required)
defineRule('email', email)
defineRule('min', min)

// 定義 checkbox 驗證規則（必須勾選）
defineRule('accepted', (value) => {
  if (value === true || value === 'true') {
    return true
  }
  return false
})

// 取得動態傳入country欄位的值
defineRule('phone', (value, [country]) => {
  const phoneRegex = country === 'Taiwan' ? /^\d{10}$/ : /^\d{11}$/
  // USA: /^(\+1|0)[789]0-\d{4}-\d{4}$/, // 美國手機號碼格式
  // Taiwan: /^(\+886|0)9\d{2}-?\d{3}-?\d{3}$/ // 台灣手機號碼格式
  if (phoneRegex.test(value)) {
    return true
  }
  return false
})

configure({
  generateMessage: localize({
    zh_TW: {
      messages: {
        ...zh_TW.messages,
        required: ' {field} 為必填欄位',
        email: '請輸入正確的電子郵件格式',
        phone: '請輸入正確的手機號碼格式',
        accepted: '您必須同意條款和條件',
      }
    },
    en: {
      messages: {
        ...en.messages,
        required: 'The {field} field is required',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number format',
        accepted: 'You must agree to the terms and conditions',
      }
    }
  }),
  validateOnInput: true
})

localize('zh_TW')

const form = ref(null)
const countries = [
  { value: 'USA', name: 'USA' },
  { value: 'Taiwan', name: 'Taiwan' }
]
const showPassword = ref(false)
const updateLanguage = (languageVal) => {
  localize(languageVal)
  form.value.validate()
}
const onFormSubmit = (values) => {
  console.log('Form Submitted:', values)
  alert('Sign up successful!')
  form.value.resetForm()
}
const togglePassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style lang="scss">
.container {
  h3 {
    font-weight: bold;
  }

  .form-label {
    font-weight: bold;
  }

  span {
    color: rgb(229, 0, 0);
    font-size: 0.9rem;
  }

  button {
    margin-right: 10px;
  }
}
</style>