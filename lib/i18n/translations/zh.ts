import { mergeTranslations } from "../merge-translations"

/** Nav labels only — homepage marketing copy falls back to English (install / work-from-home model). */
export const zh = mergeTranslations({
  nav: {
    freeReview: "免费案件评估",
    help: "帮助",
    about: "关于我们",
    services: "服务",
    whyUs: "为什么选择我们",
    process: "流程",
    faq: "常见问题",
    contact: "联系",
    emailForReview: "邮件咨询",
    language: "语言",
  },
})
