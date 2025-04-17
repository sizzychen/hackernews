<script setup lang="ts">
const props = defineProps<{
  loading: boolean
}>()

// Create reactive timer variable to track elapsed time
const elapsedSeconds = ref(0)
const timerInterval = ref<NodeJS.Timeout | null>(null)

// Format the elapsed time display
const formattedTime = computed(() => {
  if (elapsedSeconds.value < 60) {
    return `${elapsedSeconds.value}s`
  } else {
    const minutes = Math.floor(elapsedSeconds.value / 60)
    const seconds = elapsedSeconds.value % 60
    return `${minutes}m ${seconds}s`
  }
})

// Start or stop timer based on loading prop changes
watchEffect(() => {
  if (props.loading) {
    startTimer()
  } else {
    stopTimer()
  }
})

// Start the timer
function startTimer() {
  // Reset timer when starting
  elapsedSeconds.value = 0
  
  // Clear any existing interval first to avoid duplicates
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
  
  // Set interval to increment elapsed seconds every second
  timerInterval.value = setInterval(() => {
    elapsedSeconds.value++
  }, 1000)
}

// Stop the timer
function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

// Clear interval when component is unmounted to prevent memory leaks
onBeforeUnmount(() => {
  stopTimer()
})
</script>

<template>
  <div
    v-if="loading"
    class="loading-container"
  >
    <LoadSpinner />
    <div class="elapsed-time" v-if="elapsedSeconds > 2">
      Loading... {{ formattedTime }}
    </div>
  </div>
  <slot v-else />
</template>

<style lang="postcss" scoped>
.loading-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.elapsed-time {
  font-size: 0.85rem;
  color: #999;
  margin-top: -15px;
  margin-bottom: 20px;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 0.8; }
}
</style>