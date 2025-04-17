<script setup lang="ts">
import type { Item } from '~~/types'
import { timeAgo, host, isAbsolute } from '~/utils'
import TooltipError from '~/components/TooltipError.vue'

const route = useRoute()
const router = useRouter()
const state = useStore()

// Get search query from URL
const query = ref<string>('')
const page = ref<number>(1)
const perPage = 20
const maxPage = ref<number>(1)
const searchResults = ref<Item[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

// Watch for URL query parameter changes
watchEffect(() => {
  const q = route.query.q
  if (typeof q === 'string') {
    query.value = q
    
    // Get page from URL if available, otherwise default to 1
    const p = route.query.page
    page.value = p ? parseInt(p as string, 10) || 1 : 1
    
    if (query.value) {
      performSearch()
    }
  } else {
    searchResults.value = []
    loading.value = false
  }
})

// Set page title
useHead({
  title: computed(() => `Search: ${query.value}`)
})

async function performSearch() {
  if (!query.value.trim()) {
    searchResults.value = []
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await $fetch('/api/hn/search', { 
      params: { 
        q: query.value,
        page: page.value,
        limit: perPage
      }
    })
    
    // Update store with search results
    if (response && Array.isArray(response.items)) {
      searchResults.value = response.items
      maxPage.value = Math.ceil(response.total / perPage) || 1
      
      // Store items in the global store
      response.items.forEach((item: Item) => {
        if (state.value.items[item.id]) {
          Object.assign(state.value.items[item.id], item)
        } else {
          state.value.items[item.id] = item
        }
      })
    } else {
      searchResults.value = []
      maxPage.value = 1
    }
  } catch (err) {
    console.error('Search error:', err)
    error.value = 'Failed to perform search. Please try again.'
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

function changePage(newPage: number) {
  if (newPage < 1 || newPage > maxPage.value) return
  
  router.push({
    path: '/search',
    query: { 
      q: query.value,
      page: newPage 
    }
  })
}
</script>

<template>
  <div class="search-view">
    <h1 class="search-header">Search Results</h1>
    <LoadingWrapper :loading="loading">
      <TooltipError
        v-if="error"
        :message="error"
        type="error"
        position="top"
        class="search-error"
      />
      
      <template v-else-if="searchResults.length === 0">
        <div v-if="query" class="no-results">
          No results found for "<strong>{{ query }}</strong>"
        </div>
        <div v-else class="empty-search">
          Enter a search query to find stories
        </div>
      </template>

      <div v-else class="news-list">
        <p class="result-count">Found {{ searchResults.length }} results for "<strong>{{ query }}</strong>"</p>
        <ul>
          <PostItem
            v-for="item in searchResults"
            :key="item.id"
            :item="item"
          />
        </ul>
        
        <!-- Pagination -->
        <div class="news-list-nav" v-if="maxPage > 1">
          <span 
            :class="['page-nav', { disabled: page <= 1 }]" 
            @click="page > 1 && changePage(page - 1)"
          >
            &lt; prev
          </span>
          
          <span class="page-info">{{ page }} of {{ maxPage }}</span>
          
          <span 
            :class="['page-nav', { disabled: page >= maxPage }]" 
            @click="page < maxPage && changePage(page + 1)"
          >
            more &gt;
          </span>
        </div>
      </div>
    </LoadingWrapper>
  </div>
</template>

<style lang="postcss" scoped>
.search-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-header {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
  margin: 0 0 20px;
  font-size: 1.6em;
  font-weight: 500;
}

.news-list {
  background-color: #fff;
  border-radius: 2px;
  width: 100%;
  
  & ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
}

.news-list-nav {
  padding: 15px 30px;
  text-align: center;
  
  .page-nav {
    cursor: pointer;
    margin: 0 1em;
    user-select: none;
    
    &:hover:not(.disabled) {
      color: #00C48D;
    }
    
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  .page-info {
    display: inline-block;
    min-width: 80px;
  }
}

.result-count {
  padding: 15px 30px 0;
  margin: 0;
  color: #596064;
  font-size: 0.9em;
}

.no-results, .empty-search {
  padding: 30px;
  text-align: center;
  font-size: 1.1em;
  color: #666;
}

.search-error {
  position: relative;
  margin: 20px 0;
}

@media (max-width: 600px) {
  .search-view {
    padding: 0 10px;
  }
  
  .search-header h1 {
    font-size: 1.4em;
  }
  
  .news-list-nav {
    padding: 10px 15px;
    
    .page-nav {
      margin: 0 0.5em;
    }
  }
  
  .result-count {
    padding: 10px 15px 0;
  }
}
</style>