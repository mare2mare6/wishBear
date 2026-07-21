/**
 * 상품 링크에서 제목/이미지/가격을 최대한 실제 정보로 채워보는 스크래퍼.
 *
 * 우선순위:
 *  1. JSON-LD(schema.org Product) — 대부분의 이커머스가 SEO를 위해 넣어두는
 *     구조화 데이터라 og 태그보다 훨씬 정확합니다.
 *  2. og:title / og:image 등 메타태그
 *  3. 본문에서 "12,400원" / "₩12,400" 같은 패턴으로 가격 추정
 *
 * ⚠️ 쿠팡/네이버쇼핑 같은 대형 커머스는 봇 차단(Cloudflare 등)이 강해서
 * 서버가 직접 fetch하는 방식으로는 종종 막힙니다. 이 경우 정확도가 떨어질 수 있어
 * usedFallback 플래그로 "자동으로 못 찾았다"는 걸 프론트에 알려주고,
 * 오너가 직접 제목/가격을 수정할 수 있게 해두었습니다(권장되는 대응 방식).
 */

export type ScrapedProduct = {
  title: string;
  price: string;
  imageUrl: string;
  sourceUrl: string;
  usedFallback: boolean;
};

const FALLBACK_IMAGE =
  "https://placehold.co/400x400/EFE7D6/C9BBA0?text=Product+Image";
const FALLBACK_TITLE = "";
const FALLBACK_PRICE = "";

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
      "i"
    ),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match?.[1]) return decodeEntities(match[1]);
  }
  return null;
}

function extractTitleTag(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1] ? decodeEntities(match[1]) : null;
}

function extractPriceGuess(html: string): string | null {
  const match = html.match(/[₩]\s?([\d,]{4,})|([\d,]{4,})\s?원/);
  const raw = match?.[1] ?? match?.[2];
  return raw ? raw.replace(/,$/, "") : null;
}

function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? Number(value.replace(/[^\d.]/g, "")) : value;
  if (!Number.isFinite(num)) return "";
  return Math.round(num).toLocaleString("ko-KR");
}

type JsonLdProduct = {
  title?: string;
  price?: string;
  imageUrl?: string;
};

function tryExtractFromJsonLd(html: string): JsonLdProduct {
  const scripts = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];

  for (const scriptMatch of scripts) {
    try {
      const raw = scriptMatch[1].trim();
      const parsed = JSON.parse(raw);
      const candidates = Array.isArray(parsed) ? parsed : [parsed, ...(parsed?.["@graph"] ?? [])];

      for (const node of candidates) {
        if (!node) continue;
        const type = node["@type"];
        const isProduct = type === "Product" || (Array.isArray(type) && type.includes("Product"));
        if (!isProduct) continue;

        const title = typeof node.name === "string" ? decodeEntities(node.name) : undefined;

        let imageUrl: string | undefined;
        if (typeof node.image === "string") imageUrl = node.image;
        else if (Array.isArray(node.image) && typeof node.image[0] === "string")
          imageUrl = node.image[0];
        else if (node.image?.url) imageUrl = node.image.url;

        let price: string | undefined;
        const offers = Array.isArray(node.offers) ? node.offers[0] : node.offers;
        if (offers?.price) price = formatPrice(offers.price);
        else if (offers?.priceSpecification?.price)
          price = formatPrice(offers.priceSpecification.price);

        if (title || price || imageUrl) {
          return { title, price, imageUrl };
        }
      }
    } catch {
      // JSON 파싱 실패 시 다음 script 태그로 계속 진행
      continue;
    }
  }

  return {};
}

export async function scrapeProduct(url: string): Promise<ScrapedProduct> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);

    const html = await res.text();

    const jsonLd = tryExtractFromJsonLd(html);

    const title =
      jsonLd.title ?? extractMeta(html, "og:title") ?? extractTitleTag(html) ?? "";
    const imageUrl = jsonLd.imageUrl ?? extractMeta(html, "og:image") ?? "";
    const price = jsonLd.price ?? extractPriceGuess(html) ?? "";

    const usedFallback = !title || !price;

    return {
      title: (title || FALLBACK_TITLE).slice(0, 120),
      price: price || FALLBACK_PRICE,
      imageUrl: imageUrl || FALLBACK_IMAGE,
      sourceUrl: url,
      usedFallback,
    };
  } catch {
    return {
      title: FALLBACK_TITLE,
      price: FALLBACK_PRICE,
      imageUrl: FALLBACK_IMAGE,
      sourceUrl: url,
      usedFallback: true,
    };
  }
}