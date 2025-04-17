<script setup lang="ts">
import { validFeeds } from '~~/utils/api'

const router = useRouter()
const query = ref('')
const isSearching = ref(false)
const debounceTimeout = ref<NodeJS.Timeout | null>(null)

const isValid = computed(() => {
  return query.value.trim().length > 0
})

const handleSubmit = () => {
  if (!isValid.value) return
  
  isSearching.value = true
  // Navigate to search page with query parameter
  router.push(`/search?q=${encodeURIComponent(query.value.trim())}`)
  isSearching.value = false
}

// Watch for changes in search input
watch(query, (newValue) => {
  // Clear any existing timeout
  if (debounceTimeout.value) {
    clearTimeout(debounceTimeout.value)
  }
  
  // If query is empty, navigate back to default feed after delay
  if (!newValue || newValue.trim() === '') {
    debounceTimeout.value = setTimeout(() => {
      // Only navigate if we're currently on the search page
      if (router.currentRoute.value.path === '/search') {
        router.push(`/${validFeeds[0]}/1`)
      }
    }, 300)
  }
}, { immediate: false })
</script>

<template>
  <div class="search-container">
    <form @submit.prevent="handleSubmit" class="search-form">
      <input
        v-model="query"
        type="search"
        placeholder="Search by title, url or domain..."
        class="search-input"
        aria-label="Search"
      >
      <button type="submit" class="search-button" :disabled="!isValid || isSearching">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" class="search-icon">
          <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
        </svg>
      </button>
    </form>
  </div>
</template>

<style lang="postcss" scoped>
.search-container {
  display: inline-flex;
  align-items: center;
  margin-left: 10px;
}

.search-form {
  display: flex;
  position: relative;
}

.search-input {
  width: 200px;
  padding: 6px 35px 6px 12px;
  border: 1px solid #eee;
  border-radius: 15px;
  font-size: 14px;
  color: #2c3e50;
  background-color: #f9f9f9;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #00C48D;
    background-color: white;
    box-shadow: 0 0 0 2px rgba(0, 196, 141, 0.1);
  }
  
  &::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
    height: 16px;
    width: 16px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'%3E%3Cpath d='M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z'/%3E%3C/svg%3E") no-repeat 50% 50%;
    background-size: contain;
    opacity: 0.7;
    margin-right: 8px;
    cursor: pointer;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 1;
    }
  }
  
  &::-moz-search-cancel-button {
    cursor: pointer;
  }
}

.search-button {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #00C48D;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

@media (max-width: 768px) {
  .search-input {
    width: 150px;
    padding-right: 35px;
  }
}

@media (max-width: 600px) {
  .search-container {
    margin: 5px 0;
    width: 100%;
  }
  
  .search-form {
    width: 100%;
  }
  
  .search-input {
    width: 100%;
    padding-right: 35px;
  }
}
</style>