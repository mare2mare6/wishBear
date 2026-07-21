import type { ApiRoom, CreateRoomResponse } from "./types";

export type ScrapedProduct = {
  title: string;
  price: string;
  imageUrl: string;
  sourceUrl: string;
  usedFallback: boolean;
};

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (data && data.error) || "요청에 실패했어요.";
    throw new Error(message);
  }
  return data as T;
}

export async function createRoom(nickname: string, birthday: string) {
  const res = await fetch("/api/rooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname, birthday }),
  });
  return handle<CreateRoomResponse>(res);
}

export async function getRoom(roomId: string, guestName?: string) {
  const query = guestName ? `?guestName=${encodeURIComponent(guestName)}` : "";
  const res = await fetch(`/api/rooms/${roomId}${query}`, { cache: "no-store" });
  return handle<ApiRoom>(res);
}

export async function previewItem(roomId: string, ownerToken: string, link: string) {
  const res = await fetch(`/api/rooms/${roomId}/items/preview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-owner-token": ownerToken,
    },
    body: JSON.stringify({ link }),
  });
  return handle<ScrapedProduct>(res);
}

export async function addItem(
  roomId: string,
  ownerToken: string,
  data: { link: string; title: string; price: string; imageUrl: string }
) {
  const res = await fetch(`/api/rooms/${roomId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-owner-token": ownerToken,
    },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function removeItem(roomId: string, ownerToken: string, itemId: string) {
  const res = await fetch(`/api/rooms/${roomId}/items/${itemId}`, {
    method: "DELETE",
    headers: { "x-owner-token": ownerToken },
  });
  return handle(res);
}

export async function addBan(roomId: string, ownerToken: string, text: string) {
  const res = await fetch(`/api/rooms/${roomId}/bans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-owner-token": ownerToken,
    },
    body: JSON.stringify({ text }),
  });
  return handle(res);
}

export async function removeBan(roomId: string, ownerToken: string, banId: string) {
  const res = await fetch(`/api/rooms/${roomId}/bans/${banId}`, {
    method: "DELETE",
    headers: { "x-owner-token": ownerToken },
  });
  return handle(res);
}

export async function reserveItem(
  roomId: string,
  itemId: string,
  guestName: string,
  type: "solo" | "together"
) {
  const res = await fetch(`/api/rooms/${roomId}/items/${itemId}/reserve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ guestName, type }),
  });
  return handle(res);
}