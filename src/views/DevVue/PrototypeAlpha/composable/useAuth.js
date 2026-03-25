import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '../../../../composables/useToast'

export function useAuth() {
  const router = useRouter()
  const { showToast } = useToast()

  const loginInfo = ref({
    username: '',
    password: ''
  })
  const loading = ref(false)

  const login = async () => {
    loading.value = true
    try {
      const isValid = loginInfo.value.username === 'aduser' && loginInfo.value.password === '1234'
      
      if(!isValid) {
        showToast('帳號或密碼錯誤')
        return
      }
      router.push({ path: '/prototypealpha/board', query: { username: loginInfo.value.username }})
      showToast('登入成功')
    } catch(err) {
      showToast('帳號或密碼錯誤', 'danger')
    } finally {
      loading.value = false
    }
  }
  
  const logout = () => {
    const confirmed = window.confirm('確定要登出嗎？')
    if (confirmed) {
      router.push('/prototypealpha')
      showToast('已登出', 'success')
      return true  // 告知呼叫方已確認登出
    }
    return false
  }

  return { loginInfo, login, loading, logout }
}