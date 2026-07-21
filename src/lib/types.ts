export type ItemMode = "none" | "solo" | "co-gift";

export type ApiItem = {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  sourceUrl: string;
  mode: ItemMode;
  reservedCount: number;
  reservedNames: string[];
  // 요청자 본인이 이미 이 상품을 찜했는지 (같은 guestName 기준, 데모 수준의 식별)
  reservedByMe: boolean;
};

export type ApiBan = {
  id: string;
  text: string;
};

export type ApiRoom = {
  id: string;
  nickname: string;
  birthday: string | null;
  items: ApiItem[];
  bans: ApiBan[];
};

export type CreateRoomResponse = {
  room: ApiRoom;
  ownerToken: string;
};