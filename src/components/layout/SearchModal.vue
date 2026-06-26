<template>
  <Transition name="fade">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
      @click.self="$emit('update:modelValue', false)"
    >
      <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl shadow-purple-200/40 overflow-hidden">
        <!-- Search Input -->
        <div class="flex items-center gap-3 px-5 py-4 border-b border-purple-100">
          <i class="ti ti-search text-purple-400 text-xl flex-shrink-0" aria-hidden="true" />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="Search fragrances, collections..."
            class="flex-1 text-base text-gray-900 outline-none placeholder-gray-400"
            @keydown.escape="$emit('update:modelValue', false)"
            @keydown.enter="goToSearch"
          />
          <button
            v-if="query"
            @click="query = ''"
            class="p-1 text-gray-400 hover:text-gray-700 transition"
            aria-label="Clear"
          >
            <i class="ti ti-x text-sm" aria-hidden="true" />
          </button>
          <kbd class="hidden sm:block text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg font-mono">ESC</kbd>
        </div>

        <!-- Results -->
        <div class="max-h-96 overflow-y-auto">
          <!-- Loading -->
          <div v-if="loading" class="p-5 space-y-3">
            <div v-for="n in 4" :key="n" class="flex gap-3 animate-pulse">
              <div class="w-12 h-12 rounded-xl skeleton flex-shrink-0" />
              <div class="flex-1 space-y-2 pt-1">
                <div class="h-3 skeleton w-2/3" />
                <div class="h-3 skeleton w-1/3" />
              </div>
            </div>
          </div>

          <!-- Suggestions -->
          <div v-else-if="results.length">
            <div class="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Products
            </div>
            <div
              v-for="product in results"
              :key="product.id"
              @click="goToProduct(product.id)"
              class="flex items-center gap-4 px-5 py-3 hover:bg-purple-50 cursor-pointer transition group"
            >
              <div class="w-12 h-12 rounded-xl overflow-hidden bg-purple-50 flex-shrink-0 border border-purple-100">
                <img
                  v-if="product.image_url"
                  :src="imageUrl(product.image_url)"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <i class="ti ti-photo text-purple-200 text-lg" aria-hidden="true" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition line-clamp-1">
                  {{ product.name }}
                </p>
                <p class="text-xs text-purple-500 font-medium">${{ product.price.toFixed(2) }}</p>
              </div>
              <i class="ti ti-arrow-right text-gray-300 group-hover:text-purple-400 transition" aria-hidden="true" />
            </div>

            <!-- View All -->
            <div class="border-t border-purple-100 px-5 py-3">
              <button
                @click="goToSearch"
                class="w-full text-center text-sm font-semibold text-purple-600 hover:text-purple-700 transition"
              >
                View all results for "{{ query }}" →
              </button>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="query.length >= 2 && !loading" class="py-12 text-center">
            <i class="ti ti-search-off text-3xl text-purple-200 block mb-2" aria-hidden="true" />
            <p class="text-sm text-gray-500">No products found for "{{ query }}"</p>
          </div>

          <!-- Quick Links -->
          <div v-else-if="!query" class="p-5">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular Searches</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in quickSearches"
                :key="tag"
                @click="query = tag"
                class="text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full transition font-medium"
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
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { productService } from '@/services/productService'
import { imageUrl } from '@/utils/image'
import type { Product } from '@/types/product'

const props = defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [val: boolean] }>()

const router = useRouter()
const query = ref('')
const results = ref<Product[]>([])
const loading = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const quickSearches = ['Rose', 'Oud', 'Vanilla', 'Floral', 'Unisex', 'Gift Set']

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
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
