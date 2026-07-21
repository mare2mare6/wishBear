"use client";

import { useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { THEME } from "@/lib/theme";
import { Logo, ClayButton, GhostButton, TextInput, ProductImage } from "./ui";
import type { ScrapedProduct } from "@/lib/api-client";

type Step = "link" | "edit";

export function AddWishScreen({
  onClose,
  onPreview,
  onSubmit,
}: {
  onClose: () => void;
  onPreview: (link: string) => Promise<ScrapedProduct>;
  onSubmit: (data: { link: string; title: string; price: string; imageUrl: string }) => Promise<void>;
}) {
  const [step, setStep] = useState<Step>("link");
  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [usedFallback, setUsedFallback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchInfo = async () => {
    if (!link.trim()) return;
    setLoading(true);
    setError("");
    try {
      const scraped = await onPreview(link.trim());
      setTitle(scraped.title);
      setPrice(scraped.price);
      setImageUrl(scraped.imageUrl);
      setUsedFallback(scraped.usedFallback);
      setStep("edit");
    } catch (e) {
      setError(e instanceof Error ? e.message : "정보를 가져오지 못했어요.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !price.trim()) {
      setError("제목과 가격을 입력해주세요.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit({ link: link.trim(), title: title.trim(), price: price.trim(), imageUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : "등록에 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col px-6" style={{ background: THEME.bg }}>
      <div className="flex justify-between items-center pt-6">
        {step === "edit" ? (
          <button onClick={() => setStep("link")} aria-label="뒤로">
            <ArrowLeft size={20} color={THEME.subText} />
          </button>
        ) : (
          <span />
        )}
        <button onClick={onClose} aria-label="닫기">
          <X size={22} color={THEME.subText} />
        </button>
      </div>
      <Logo />

      {step === "link" && (
        <>
          <div className="mt-8 text-center">
            <h1 className="font-display text-2xl" style={{ color: THEME.heading }}>
              위시리스트 추가
            </h1>
            <p className="mt-2 text-sm" style={{ color: THEME.subText }}>
              원하는 상품을 등록해보세요!
            </p>
          </div>

          <div className="mt-8">
            <TextInput value={link} onChange={setLink} placeholder="상품의 링크를 적어주세요." />
          </div>

          {error && (
            <p className="mt-3 text-xs text-center" style={{ color: THEME.banHeading }}>
              {error}
            </p>
          )}

          <div className="flex-1" />

          <div className="pb-10">
            <ClayButton onClick={handleFetchInfo} disabled={loading || !link.trim()}>
              {loading ? "상품 정보를 불러오는 중..." : "정보 가져오기"}
            </ClayButton>
          </div>
        </>
      )}

      {step === "edit" && (
        <>
          <div className="mt-6 text-center">
            <h1 className="font-display text-2xl" style={{ color: THEME.heading }}>
              내용을 확인해주세요
            </h1>
            <p className="mt-2 text-sm" style={{ color: THEME.subText }}>
              {usedFallback
                ? "자동으로 정보를 다 찾지 못했어요. 직접 채워주세요!"
                : "자동으로 가져왔어요. 필요하면 수정해주세요."}
            </p>
          </div>

          <div className="mt-6 w-32 mx-auto">
            <ProductImage src={imageUrl} alt={title || "상품 이미지"} />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <div>
              <label className="text-xs" style={{ color: THEME.subText }}>
                상품명
              </label>
              <div className="mt-1">
                <TextInput value={title} onChange={setTitle} placeholder="상품명을 입력해주세요" />
              </div>
            </div>
            <div>
              <label className="text-xs" style={{ color: THEME.subText }}>
                가격 (숫자만, ₩ 제외)
              </label>
              <div className="mt-1">
                <TextInput value={price} onChange={setPrice} placeholder="예: 12,400" />
              </div>
            </div>
            <div>
              <label className="text-xs" style={{ color: THEME.subText }}>
                이미지 링크
              </label>
              <div className="mt-1">
                <TextInput value={imageUrl} onChange={setImageUrl} placeholder="이미지 URL" />
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-3 text-xs text-center" style={{ color: THEME.banHeading }}>
              {error}
            </p>
          )}

          <div className="flex-1" />

          <div className="pb-10 flex flex-col gap-2">
            <ClayButton onClick={handleSubmit} disabled={loading}>
              {loading ? "등록 중..." : "등록"}
            </ClayButton>
            <GhostButton small onClick={() => setStep("link")}>
              링크 다시 입력하기
            </GhostButton>
          </div>
        </>
      )}
    </div>
  );
}