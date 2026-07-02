<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="open = !open"
      class="lang-trigger"
      :aria-label="$t('language.switchTo')"
    >
      <span :class="['fi', `fi-${current.country}`, 'flag']"></span>
      <span class="label">{{ current.label }}</span>
      <i class="ti ti-chevron-down arrow" :class="{ 'is-open': open }" aria-hidden="true" />
    </button>

    <Transition name="lang-dropdown">
      <div v-if="open" class="lang-menu">
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="switchLang(lang.code)"
          class="lang-option"
          :class="{ active: locale === lang.code }"
        >
          <span :class="['fi', `fi-${lang.country}`, 'flag']"></span>
          <span class="label">{{ lang.label }}</span>
          <i v-if="locale === lang.code" class="ti ti-check check" aria-hidden="true" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const open = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const languages = [
  { code: 'en', country: 'us', label: 'English' },
  { code: 'km', country: 'kh', label: 'ភាសាខ្មែរ' },
]

const current = computed(() =>
  languages.find((l) => l.code === locale.value)!
)

function switchLang(code: string) {
  locale.value = code
  localStorage.setItem('locale', code)
  open.value = false
}

function onClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<style scoped>
.lang-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s;
  color: var(--secondary);
  font-family: var(--font-body);
}
.lang-trigger:hover {
  background: rgba(0, 0, 0, 0.04);
}

.flag {
  font-size: 1.2em;
  line-height: 1;
  border-radius: 2px;
}

.label {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.arrow {
  font-size: 10px;
  transition: transform 0.2s;
  color: var(--text-muted);
}
.arrow.is-open {
  transform: rotate(180deg);
}

.lang-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 6px);
  min-width: 160px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  border: 1px solid var(--border);
  padding: 6px;
  z-index: 60;
  overflow: hidden;
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  transition: background 0.15s;
  text-align: left;
  font-family: var(--font-body);
}
.lang-option:hover {
  background: rgba(184, 138, 68, 0.08);
}
.lang-option.active {
  background: rgba(184, 138, 68, 0.1);
  color: var(--primary);
  font-weight: 600;
}

.check {
  margin-left: auto;
  font-size: 14px;
  color: var(--primary);
}

.lang-dropdown-enter-active,
.lang-dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.lang-dropdown-enter-from,
.lang-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
