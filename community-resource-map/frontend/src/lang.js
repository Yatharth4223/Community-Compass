export const LANGS = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "hi", label: "हिन्दी" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "es", label: "Español" },
];

export const STRINGS = {
  en: {
    title: "Community Resources",
    subtitle: "Find help near you",
    category: "Category",
    wheelchairOnly: "Wheelchair accessible only",
    useLocation: "Use my location",
    emergency: "Emergency — Help Now",
    nearby: "Nearby Resources",
    found: "found",
  },
  fr: {
    title: "Ressources communautaires",
    subtitle: "Trouvez de l’aide près de vous",
    category: "Catégorie",
    wheelchairOnly: "Accessible en fauteuil roulant uniquement",
    useLocation: "Utiliser ma position",
    emergency: "Urgence — Aide maintenant",
    nearby: "Ressources à proximité",
    found: "trouvées",
  },
  hi: {
    title: "समुदाय संसाधन",
    subtitle: "अपने पास मदद खोजें",
    category: "श्रेणी",
    wheelchairOnly: "केवल व्हीलचेयर सुलभ",
    useLocation: "मेरी लोकेशन उपयोग करें",
    emergency: "आपातकाल — अभी मदद",
    nearby: "पास के संसाधन",
    found: "मिले",
  },
  pa: {
    title: "ਕਮਿਊਨਿਟੀ ਸਰੋਤ",
    subtitle: "ਨੇੜੇ ਮਦਦ ਲੱਭੋ",
    category: "ਸ਼੍ਰੇਣੀ",
    wheelchairOnly: "ਸਿਰਫ਼ ਵ੍ਹੀਲਚੇਅਰ ਲਈ ਸੁਗਮ",
    useLocation: "ਮੇਰੀ ਲੋਕੇਸ਼ਨ ਵਰਤੋ",
    emergency: "ਐਮਰਜੈਂਸੀ — ਤੁਰੰਤ ਮਦਦ",
    nearby: "ਨੇੜਲੇ ਸਰੋਤ",
    found: "ਮਿਲੇ",
  },
  es: {
    title: "Recursos comunitarios",
    subtitle: "Encuentra ayuda cerca de ti",
    category: "Categoría",
    wheelchairOnly: "Solo accesible en silla de ruedas",
    useLocation: "Usar mi ubicación",
    emergency: "Emergencia — Ayuda ahora",
    nearby: "Recursos cercanos",
    found: "encontrados",
  },
};

export function t(lang, key) {
  return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
}
