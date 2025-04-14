import { VueI18n } from 'vue-i18n';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: (key: string, values?: Record<string, any>) => string;

    $i18n: VueI18n;
  }
}
