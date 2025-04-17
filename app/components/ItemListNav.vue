<script setup lang="ts">
import TooltipError from '~/components/TooltipError.vue'

const props = defineProps<{
  feed: string
  page: number
  maxPage: number
}>()

const router = useRouter()
const hasMore = computed(() => props.page < props.maxPage)

const jumpPage = ref<number>(props.page)
const errorMsg = ref('')

const handleJumpToPage = (e: Event) => {
  e.preventDefault()
  const targetPage = Number(jumpPage.value)


  // Check if the target page input is:
  // 1. Not a valid number (isNaN)
  // 2. Less than page 1
  // 3. Greater than the maximum available page
  if (isNaN(targetPage) || targetPage < 1 || targetPage > props.maxPage) {
    // Display error message with valid page range
    errorMsg.value = `Please enter a valid page number between 1 and ${props.maxPage}`
    return
  }

  if (targetPage === props.page) {
    return
  }

  errorMsg.value = ''
  router.push(`/${props.feed}/${targetPage}`)
}
</script>

<template>
  <div class="news-list-nav">
    <NuxtLink
      v-if="page > 1"
      :to="`/${feed}/${page - 1}`"
    >
      &lt; prev
    </NuxtLink>
    <span
      v-else
      class="disabled"
    >&lt; prev</span>

    <form 
      class="jump-form"
      @submit="handleJumpToPage"
    >
      <input
        v-model="jumpPage"
        type="number"
        class="page-input"
        :min="1"
        :max="maxPage"
        :placeholder="page.toString()"
      >
      <button 
        type="submit"
        class="jump-btn"
      >
        Go
      </button>
    </form>
    <span class="total-pages">of {{ maxPage }}</span>

    <TooltipError
      v-if="errorMsg"
      :message="errorMsg"
      position="bottom"
    />

    <NuxtLink
      v-if="hasMore"
      :to="`/${feed}/${page + 1}`"
    >
      more &gt;
    </NuxtLink>
    <span
      v-else
      class="disabled"
    >more &gt;</span>
  </div>
</template>

<style lang="postcss">
.news-list-nav, .news-list {
  background-color: #fff;
}

.news-list-nav {
  padding: 15px 30px 25px;
  text-align: center;
  user-select: none;
  position: relative;

  & a {
    margin: 0 1em;
  }

  .disabled {
    opacity: 0.7;
    margin: 0 1em;
    cursor: not-allowed;
    transition: cursor 0.2s ease;
  }

  .jump-form {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0 0.5em;
  }

  .total-pages {
    opacity: 0.7;
    margin-right: 1em;
  }

  .page-input {
    width: 60px;
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: center;
    font-size: 14px;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  .jump-btn {
    padding: 4px 12px;
    background-color: #f60;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background-color: #ff7518;
    }
  }
}

  @media (max-width: 600px) {
    .news-list-nav {
      padding: 10px 15px 20px;

      .jump-form {
        margin: 0 0.25em;
      }

      .total-pages {
        margin-right: 0.5em;
      }

      .page-input {
        width: 50px;
        padding: 3px 6px;
      }

      .jump-btn {
        padding: 3px 8px;
      }

      & a,
      .disabled {
        margin: 0 0.5em;
      }
    }
  }
</style>