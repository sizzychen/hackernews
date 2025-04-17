<script setup lang="ts">
defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'error',
    validator: (value: string) => ['error', 'warning', 'info'].includes(value)
  },
  position: {
    type: String,
    default: 'bottom',
    validator: (value: string) => ['top', 'bottom'].includes(value)
  }
})

// Determine which icon to show based on message type
const iconPath = computed(() => {
  switch (props.type) {
    case 'error':
      return 'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z'
    case 'warning':
      return 'M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z'
    case 'info':
      return 'M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
    default:
      return 'M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z'
  }
})

// Map type to color
const typeColor = computed(() => {
  switch (props.type) {
    case 'error':
      return '#ff4444'
    case 'warning':
      return '#ffbb33'
    case 'info':
      return '#33b5e5'
    default:
      return '#ff4444'
  }
})
</script>

<template>
  <div 
    v-if="message" 
    class="tooltip-error" 
    :class="[type, position]"
    role="alert"
    aria-live="polite"
  >
    <svg 
      class="tooltip-icon" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      :fill="typeColor"
      width="18" 
      height="18"
    >
      <path :d="iconPath" />
    </svg>
    <span class="tooltip-message">{{ message }}</span>
  </div>
</template>

<style lang="postcss" scoped>
.tooltip-error {
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  font-size: 12px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
  max-width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: fadeIn 0.2s ease-in-out;
  
  &.top {
    bottom: calc(100% + 10px);
    &:after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: -6px;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid white;
    }
  }
  
  &.bottom {
    top: calc(100% + 10px);
    &:after {
      content: '';
      position: absolute;
      bottom: 100%;
      left: 50%;
      margin-left: -6px;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid white;
    }
  }
  
  &.error {
    border-left: 3px solid #ff4444;
  }
  
  &.warning {
    border-left: 3px solid #ffbb33;
  }
  
  &.info {
    border-left: 3px solid #33b5e5;
  }
}

.tooltip-icon {
  margin-right: 8px;
  flex-shrink: 0;
}

.tooltip-message {
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -5px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* Responsive styling */
@media (max-width: 600px) {
  .tooltip-error {
    font-size: 11px;
    padding: 6px 10px;
  }
  
  .tooltip-icon {
    width: 14px;
    height: 14px;
    margin-right: 6px;
  }
}
</style>