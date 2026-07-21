/**
 * 아주 가벼운 상품 링크 "스크래핑".
 * - og:title / og:image 메타태그를 파싱해서 최대한 실제 정보를 채워봅니다.
 * - 실패하거나 정보가 부족하면 데모용 목업 값으로 채웁니다.
 * - 가격은 사이트마다 마크업이 제각각이라 정확한 파싱이 어려워
 *   실서비스로 발전시킬 때는 사이트별 파서나 크롤링 API(예: 스크래핑 서비스)로
 *   교체하는 것을 권장합니다.
 */

export type ScrapedProduct = {
  title: string;
  price: string;
  imageUrl: string;
  sourceUrl: string;
};

const FALLBACK_IMAGE =
  "https://placehold.co/400x400/EFE7D6/C9BBA0?text=Product+Image";
const FALLBACK_TITLE = "말랑말랑 허니 베어 애착인형 특대형";
const FALLBACK_PRICE = "12,400";

function extractMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(
      `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
      "i"
    ),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match?.[1]) return match[1];
  }
  return null;
}

function extractTitleTag(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim() ?? null;
}

function extractPriceGuess(html: string): string | null {
  // "12,400원" / "₩12,400" / "12,400 ₩" 같은 흔한 패턴을 느슨하게 탐색
  const match = html.match(/[₩]\s?([\d,]{4,})|([\d,]{4,})\s?원/);
  const raw = match?.[1] ?? match?.[2];
  return raw ? raw.replace(/,$/, "") : null;
}

export async function scrapeProduct(url: string): Promise<ScrapedProduct> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; WishBearBot/1.0; +https://wishbear.app)",
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);

    const html = await res.text();

    const title =
      extractMeta(html, "og:title") ?? extractTitleTag(html) ?? FALLBACK_TITLE;
    const imageUrl = extractMeta(html, "og:image") ?? FALLBACK_IMAGE;
    const price = extractPriceGuess(html) ?? FALLBACK_PRICE;

    return {
      title: title.slice(0, 120),
      price,
      imageUrl,
      sourceUrl: url,
    };
  } catch {
    // 접근 불가 / 파싱 실패 시 데모 목업 값으로 대체
    return {
      title: FALLBACK_TITLE,
      price: FALLBACK_PRICE,
      imageUrl: FALLBACK_IMAGE,
      sourceUrl: url,
    };
  }
}
