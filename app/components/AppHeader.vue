<script setup lang="ts">
import { feedsInfo } from '~~/utils/api'
import SearchBar from '~/components/SearchBar.vue'
</script>

<template>
  <header class="header">
    <nav
      class="inner"
      role="navigation"
    >
      <NuxtLink
        to="/"
        aria-label="Go to homepage"
      >
        <svg
          class="logo"
          viewBox="0 0 900 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M504.908 750H839.476C850.103 750.001 860.542 747.229 869.745 741.963C878.948 736.696 886.589 729.121 891.9 719.999C897.211 710.876 900.005 700.529 900 689.997C899.995 679.465 897.193 669.12 891.873 660.002L667.187 274.289C661.876 265.169 654.237 257.595 645.036 252.329C635.835 247.064 625.398 244.291 614.773 244.291C604.149 244.291 593.711 247.064 584.511 252.329C575.31 257.595 567.67 265.169 562.36 274.289L504.908 372.979L392.581 179.993C387.266 170.874 379.623 163.301 370.42 158.036C361.216 152.772 350.777 150 340.151 150C329.525 150 319.086 152.772 309.883 158.036C300.679 163.301 293.036 170.874 287.721 179.993L8.12649 660.002C2.80743 669.12 0.00462935 679.465 5.72978e-06 689.997C-0.00461789 700.529 2.78909 710.876 8.10015 719.999C13.4112 729.121 21.0523 736.696 30.255 741.963C39.4576 747.229 49.8973 750.001 60.524 750H270.538C353.748 750 415.112 713.775 457.336 643.101L559.849 467.145L614.757 372.979L779.547 655.834H559.849L504.908 750ZM267.114 655.737L120.551 655.704L340.249 278.586L449.87 467.145L376.474 593.175C348.433 639.03 316.577 655.737 267.114 655.737Z"
            fill="#00DC82"
          />
        </svg>
      </NuxtLink>
      <NuxtLink
        v-for="(list, key) in feedsInfo"
        :key="key"
        :to="`/${key}`"
        :class="{ active: $route.path.startsWith(`/${key}`) }"
      >
        {{ list.title }}
      </NuxtLink>
      <SearchBar class="header-search" />
    </nav>
  </header>
</template>

<style lang="postcss" scoped>
.header {
  background-color: #020420;
  position: fixed;
  z-index: 999;
  min-height: 55px;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.inner {
  max-width: 800px;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 15px 5px;
  display: flex;
  align-items: center;
}

.logo {
  width: 24px;
  margin-right: 10px;
}

.header a {
  text-decoration: none;
  color: #ffffff;
  display: inline-block;
  vertical-align: middle;
  margin-right: 15px;
  font-size: 16px;
  font-weight: 500;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.05em;

  &.active, &:hover {
    color: #00DC82;
    text-shadow: 0 0 8px rgba(0, 220, 130, 0.3);
  }

  &.active {
    font-weight: 700;
  }
}

.header-search {
  margin-left: auto;
}

@media (max-width: 600px) {
  .inner {
    flex-wrap: wrap;
    padding: 12px 10px;
  }
  
  .header {
    min-height: 55px;
  }
  
  .header a {
    color: #ffffff;
    font-weight: 600;
  }
  
  .header-search {
    order: 3;
    margin-top: 12px;
    margin-left: 0;
    width: 100%;
    padding-bottom: 12px;
  }
}
</style>