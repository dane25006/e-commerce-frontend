import { ref } from 'vue'
import { categoryFilterMap } from '../types'

export function useCategoryFilter() {
  const selectedLabel = ref<string | null>(null)

  function select(label: string) {
    selectedLabel.value = selectedLabel.value === label ? null : label
  }

  function clear() {
    selectedLabel.value = null
  }

  const currentFilter = () =>
    selectedLabel.value ? categoryFilterMap[selectedLabel.value] ?? {} : {}

  return { selectedLabel, select, clear, currentFilter }
}
