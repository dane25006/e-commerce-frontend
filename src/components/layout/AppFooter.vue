<template>
  <footer class="footer" style="background: var(--secondary, #2B2B2B);">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
        <!-- Brand -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background: var(--primary, #B88A44);">
              <span class="text-white text-lg font-bold" style="font-family: var(--font-heading);">S</span>
            </div>
            <div>
              <div class="text-base font-bold tracking-wide" style="color: var(--surface, #FFFFFF); font-family: var(--font-heading);">{{ $t('app.name') }}</div>
              <div class="text-[9px] tracking-[0.2em] font-semibold uppercase" style="color: var(--primary, #B88A44);">{{ $t('app.brand.subtitle') }}</div>
            </div>
          </div>
          <p class="text-sm leading-relaxed mb-7 max-w-xs" style="color: var(--text-muted, #6F6F6F);">
            {{ $t('footer.description') }}
          </p>
          <div class="flex items-center gap-3">
            <a
              v-for="social in socials"
              :key="social.label"
              href="#"
              :aria-label="social.label"
              class="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
              style="background: rgba(255,255,255,0.06); color: var(--text-muted, #6F6F6F);"
            >
              <i :class="`ti ${social.icon} text-sm`" aria-hidden="true" />
            </a>
          </div>
        </div>

        <!-- Shop Links -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-[0.15em] mb-5" style="color: var(--primary, #B88A44);">{{ $t('footer.shop') }}</h4>
          <ul class="space-y-3">
            <li v-for="link in shopLinks" :key="link.label">
              <RouterLink :to="link.to" class="text-sm transition-all duration-200" style="color: var(--text-muted, #6F6F6F);">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Customer Care -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-[0.15em] mb-5" style="color: var(--primary, #B88A44);">{{ $t('footer.customerCare') }}</h4>
          <ul class="space-y-3">
            <li v-for="link in serviceLinks" :key="link.label">
              <a href="#" class="text-sm transition-all duration-200" style="color: var(--text-muted, #6F6F6F);">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact / Newsletter -->
        <div>
          <h4 class="text-xs font-bold uppercase tracking-[0.15em] mb-5" style="color: var(--primary, #B88A44);">{{ $t('footer.contact') }}</h4>
          <ul class="space-y-3 mb-6">
            <li v-for="c in contacts" :key="c.text" class="flex items-start gap-2.5">
              <i :class="`ti ${c.icon} text-sm mt-0.5 flex-shrink-0`" style="color: var(--primary, #B88A44);" aria-hidden="true" />
              <span class="text-sm" style="color: var(--text-muted, #6F6F6F);">{{ c.text }}</span>
            </li>
          </ul>

          <div>
            <p class="text-xs font-semibold mb-3" style="color: var(--text-muted, #6F6F6F);">{{ $t('footer.stayInLoop') }}</p>
            <div class="flex gap-2">
              <input
                id="footer-email"
                name="email"
                type="email"
                :placeholder="$t('footer.yourEmail')"
                class="flex-1 rounded-full text-sm text-white placeholder:opacity-50 px-4 py-2.5 outline-none transition-all duration-200"
                style="background: transparent; border: 1px solid rgba(255,255,255,0.12);"
              />
              <button class="flex-shrink-0 rounded-full w-10 h-10 flex items-center justify-center text-xs font-semibold text-white transition-all duration-200" style="background: var(--primary, #B88A44);">
                <i class="ti ti-send" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="py-6" style="border-top: 1px solid rgba(255,255,255,0.06);">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs" style="color: var(--text-muted, #6F6F6F);">
          {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
        <div class="text-xs" style="color: var(--text-muted, #6F6F6F);">
          <span>{{ $t('footer.paymentVisa') }}</span><span class="mx-2">&#183;</span>
          <span>{{ $t('footer.paymentMastercard') }}</span><span class="mx-2">&#183;</span>
          <span>{{ $t('footer.paymentAmex') }}</span><span class="mx-2">&#183;</span>
          <span>{{ $t('footer.paymentPaypal') }}</span>
        </div>
        <div class="flex items-center gap-2 text-xs" style="color: var(--text-muted, #6F6F6F);">
          <a href="#" class="transition-all duration-200">{{ $t('footer.privacyPolicy') }}</a>
          <span>&#183;</span>
          <a href="#" class="transition-all duration-200">{{ $t('footer.termsOfService') }}</a>
          <span>&#183;</span>
          <a href="#" class="transition-all duration-200">{{ $t('footer.cookiePolicy') }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const socials = computed(() => [
  { label: t('footer.instagram'), icon: 'ti-brand-instagram' },
  { label: t('footer.facebook'), icon: 'ti-brand-facebook' },
  { label: t('footer.twitter'), icon: 'ti-brand-twitter' },
  { label: t('footer.pinterest'), icon: 'ti-brand-pinterest' },
])

const shopLinks = computed(() => [
  { label: t('footer.allProducts'), to: '/products' },
  { label: t('footer.newArrivals'), to: '/products?sort=newest' },
  { label: t('footer.bestSellers'), to: '/products?sort=rating' },
  { label: t('footer.giftSets'), to: '/products' },
  { label: t('footer.travelSize'), to: '/products' },
])

const serviceLinks = computed(() => [
  { label: t('footer.trackOrder') },
  { label: t('footer.returns') },
  { label: t('footer.shippingInfo') },
  { label: t('footer.sizeGuide') },
  { label: t('footer.faq') },
])

const contacts = computed(() => [
  { icon: 'ti-map-pin', text: t('footer.contactAddress') },
  { icon: 'ti-phone', text: t('footer.contactPhone') },
  { icon: 'ti-mail', text: t('footer.contactEmail', { at: '@' }) },
  { icon: 'ti-clock', text: t('footer.contactHours') },
])
</script>
