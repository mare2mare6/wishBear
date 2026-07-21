import type { Item, Reservation } from "@prisma/client";
import type { ApiItem, ItemMode } from "./types";

type ItemWithReservations = Item & { reservations: Reservation[] };

export function serializeItem(
  item: ItemWithReservations,
  guestName: string | null
): ApiItem {
  const togetherCount = item.reservations.filter(
    (r) => r.type === "TOGETHER"
  ).length;
  const soloReservation = item.reservations.find((r) => r.type === "SOLO");

  let mode: ItemMode = "none";
  if (soloReservation) mode = "solo";
  else if (togetherCount > 0) mode = "co-gift";

  const reservedByMe = guestName
    ? item.reservations.some((r) => r.guestName === guestName)
    : false;

  return {
    id: item.id,
    title: item.title,
    price: item.price,
    imageUrl: item.imageUrl,
    sourceUrl: item.sourceUrl,
    mode,
    reservedCount: togetherCount,
    reservedByMe,
  };
}
