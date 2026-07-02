<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="search-overlay"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="search-modal">
        <div class="search-bar">
          <i class="ti ti-search search-bar-icon" aria-hidden="true" />
          <input
            ref="inputRef"
            id="search-query"
            name="query"
            v-model="query"
            type="text"
            :placeholder="$t('search.placeholder')"
            class="search-input"
            @keydown.escape="$emit('update:modelValue', false)"
            @keydown.enter="goToSearch"
          />
          <button
            v-if="query"
            @click="query = ''"
            class="clear-btn"
            :aria-label="$t('search.clear')"
          >
            <i class="ti ti-x" aria-hidden="true" />
          </button>
            <kbd class="esc-key">{{ $t('search.esc') }}</kbd>
        </div>

        <div class="search-results">
          <div v-if="loading" class="loading-results">
            <div v-for="n in 4" :key="n" class="skeleton-result">
              <div class="skeleton-thumb" />
              <div class="skeleton-text">
                <div class="skeleton-line w-2-3" />
                <div class="skeleton-line w-1-3" />
              </div>
            </div>
          </div>

          <div v-else-if="results.length">
            <div class="results-label">{{ $t('search.products') }}</div>
            <div
              v-for="product in results"
              :key="product.id"
              @click="goToProduct(product.id)"
              class="result-item"
            >
              <div class="result-thumb">
                <img
                  v-if="product.image_url"
                  :src="imageUrl(product.image_url)"
                  :alt="product.name"
                  class="result-img"
                />
                <div v-else class="result-img-ph">
                  <i class="ti ti-photo" aria-hidden="true" />
                </div>
              </div>
              <div class="result-info">
                <p class="result-name">{{ product.name }}</p>
                <p class="result-price">{{ formatPrice(product.price) }}</p>
              </div>
              <i class="ti ti-arrow-right result-arrow" aria-hidden="true" />
            </div>

            <div class="view-all-wrap">
              <button
                @click="goToSearch"
                class="view-all-btn"
              >
                {{ $t('search.viewAllResults', { query: query }) }}
              </button>
            </div>
          </div>

          <div v-else-if="query.length >= 2 && !loading" class="no-results">
            <i class="ti ti-search-off" aria-hidden="true" />
            <p>{{ $t('search.noResults', { query: query }) }}</p>
          </div>

          <div v-else-if="!query" class="quick-searches">
            <p class="quick-label">{{ $t('search.popularSearches') }}</p>
            <div class="quick-tags">
              <button
                v-for="tag in quickSearches"
                :key="tag"
                @click="query = tag"
                class="quick-tag"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { productService } from '@/services/productService'
import { imageUrl } from '@/utils/image'
import { formatPrice } from '@/utils/price'
import type { Product } from '@/types/product'

const { t } = useI18n()

const props = defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [val: boolean] }>()

const router = useRouter()
const query = ref('')
const results = ref<Product[]>([])
const loading = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const quickSearches = computed(() => [t('search.tagRose'), t('search.tagOud'), t('search.tagVanilla'), t('search.tagFloral'), t('search.tagUnisex'), t('search.tagGiftSet')])

let searchTimer: ReturnType<typeof setTimeout>

watch(query, (val) => {
  clearTimeout(searchTimer)
  if (val.length < 2) { results.value = []; return }
  loading.value = true
  searchTimer = setTimeout(async () => {
    try {
      const { data } = await productService.getAll({ search: val, per_page: 6 })
      results.value = data.products.data
    } catch {
      results.value = []
    } finally {
      loading.value = false
    }
  }, 300)
})

watch(() => props.modelValue, async (open) => {
  if (open) {
    query.value = ''
    results.value = []
    await nextTick()
    inputRef.value?.focus()
  }
})

function goToProduct(id: number) {
  router.push(`/products/${id}`)
}

function goToSearch() {
  if (query.value) {
    router.push(`/products?search=${encodeURIComponent(query.value)}`)
  }
}
</script>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 80px 16px 0;
  background: rgba(58,50,42,0.5);
  backdrop-filter: blur(12px);
}

.search-modal {
  width: 100%;
  max-width: 640px;
  background: var(--surface);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 12px 60px rgba(58,50,42,0.18);
  border: 1px solid var(--border);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}

.search-bar-icon {
  font-size: 20px;
  color: var(--primary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  font-size: 15px;
  outline: none;
  border: none;
  background: none;
  color: var(--text);
}

.search-input::placeholder {
  color: #bbb;
}

.clear-btn {
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
  color: var(--text-muted);
  border: none;
  background: none;
  cursor: pointer;
}

.clear-btn:hover {
  background: rgba(184,138,68,0.08);
  color: var(--text);
}

.esc-key {
  display: none;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  background: var(--background);
  color: var(--text-muted);
}

@media (min-width: 640px) {
  .esc-key {
    display: block;
  }
}

.search-results {
  max-height: 384px;
  overflow-y: auto;
}

.loading-results {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-result {
  display: flex;
  gap: 12px;
}

.skeleton-thumb {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  flex-shrink: 0;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 4px;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f0ece6 25%, #e8e2d8 50%, #f0ece6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.w-2-3 { width: 66.67%; }
.w-1-3 { width: 33.33%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.results-label {
  padding: 12px 20px 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
}

.result-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.2s;
}

.result-item:hover {
  background: var(--background);
}

.result-thumb {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--background);
  border: 1px solid var(--border);
}

.result-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-img-ph {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-img-ph i {
  font-size: 18px;
  color: rgba(184,138,68,0.15);
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s;
}

.result-item:hover .result-name {
  color: var(--primary);
}

.result-price {
  font-size: 12px;
  font-weight: 500;
  color: var(--primary);
}

.result-arrow {
  font-size: 14px;
  color: var(--border);
  transition: all 0.2s;
}

.result-item:hover .result-arrow {
  color: var(--primary);
  transform: translateX(2px);
}

.view-all-wrap {
  padding: 12px 20px;
  border-top: 1px solid var(--border);
}

.view-all-btn {
  width: 100%;
  text-align: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
  border: none;
  background: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.view-all-btn:hover {
  opacity: 0.8;
}

.no-results {
  padding: 48px 20px;
  text-align: center;
}

.no-results i {
  font-size: 32px;
  display: block;
  margin-bottom: 8px;
  color: rgba(184,138,68,0.2);
}

.no-results p {
  font-size: 14px;
  color: var(--text-muted);
}

.quick-searches {
  padding: 20px;
}

.quick-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--primary);
  margin-bottom: 12px;
}

.quick-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-tag {
  font-size: 13px;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 500;
  border: none;
  background: rgba(184,138,68,0.1);
  color: var(--primary);
  cursor: pointer;
  transition: all 0.2s;
}

.quick-tag:hover {
  background: rgba(184,138,68,0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
