<template>
  <div class="payment-amount">
    <p class="product-name">{{ productName }}</p>
    <h1 class="amount">
      ${{ formatted }}
      <span class="currency">{{ currency }}</span>
    </h1>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  productName: string
  amount: number
  currency: string
}>()

const formatted = computed(() => props.amount.toFixed(2))
</script>

<style scoped>
.payment-amount {
  padding: 24px 24px 20px;
  text-align: center;
}

.product-name {
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #64748B;
  margin: 0 0 8px;
}

.amount {
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-size: 54px;
  font-weight: 700;
  color: #1E293B;
  margin: 0;
  letter-spacing: -1.5px;
  line-height: 1.1;
}

.currency {
  font-size: 18px;
  font-weight: 600;
  color: #94A3B8;
  margin-left: 8px;
  letter-spacing: 0;
}
</style>
