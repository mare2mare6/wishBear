const ownerTokenKey = (roomId: string) => `wishbear:ownerToken:${roomId}`;
const GUEST_NAME_KEY = "wishbear:guestName";

export function saveOwnerToken(roomId: string, token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ownerTokenKey(roomId), token);
}

export function readOwnerToken(roomId: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ownerTokenKey(roomId));
}

export function saveGuestName(name: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GUEST_NAME_KEY, name);
}

export function readGuestName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(GUEST_NAME_KEY) ?? "";
}
