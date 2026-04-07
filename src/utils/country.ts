export const COUNTRIES: { code: string; name: string }[] = [
  { code: "AR", name: "Argentina" },
  { code: "AU", name: "Australia" },
  { code: "BR", name: "Brasil" },
  { code: "CA", name: "Canada" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "DE", name: "Alemania" },
  { code: "ES", name: "España" },
  { code: "FR", name: "Francia" },
  { code: "GB", name: "Reino Unido" },
  { code: "IN", name: "India" },
  { code: "IT", name: "Italia" },
  { code: "JP", name: "Japón" },
  { code: "KR", name: "Corea del Sur" },
  { code: "MX", name: "México" },
  { code: "PE", name: "Perú" },
  { code: "PT", name: "Portugal" },
  { code: "US", name: "Estados Unidos" },
  { code: "UY", name: "Uruguay" },
  { code: "VE", name: "Venezuela" },
];

export function detectCountry(): string {
  if (typeof navigator === "undefined") {
    return "US";
  }
  const lang = navigator.language;
  const parts = lang.split("-");
  if (parts.length >= 2) {
    return parts[1].toUpperCase();
  }
  return "US";
}

export function getCountryName(code: string): string {
  const found = COUNTRIES.find((c) => c.code === code);
  return found ? found.name : code;
}
