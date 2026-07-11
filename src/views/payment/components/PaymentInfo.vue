<template>
  <div class="payment-info">
    <p class="product-name">{{ productName }}</p>
    <p class="amount">
      ${{ amount.toFixed(2) }}
      <span class="currency">{{ currency }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  productName: string
  amount: number
  currency: string
}>()
</script>

<style scoped>
.payment-info {
  text-align: center;
  padding: 20px 24px 16px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  margin: 0 0 6px;
}

.amount {
  font-size: 36px;
  font-weight: 800;
  color: #111827;
  margin: 0;
  letter-spacing: -0.5px;
}

.currency {
  font-size: 16px;
  font-weight: 600;
  color: #9CA3AF;
  margin-left: 6px;
}
</style>
