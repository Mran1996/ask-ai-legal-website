import { mergeTranslations } from "../merge-translations"

/** Nav labels only — homepage marketing copy falls back to English (install / work-from-home model). */
export const vi = mergeTranslations({
  nav: {
    freeReview: "Đánh giá miễn phí",
    help: "Trợ giúp",
    about: "Về chúng tôi",
    services: "Dịch vụ",
    whyUs: "Tại sao chọn chúng tôi",
    process: "Quy trình",
    faq: "Câu hỏi",
    contact: "Liên hệ",
    emailForReview: "Email đánh giá",
    language: "Ngôn ngữ",
  },
})
