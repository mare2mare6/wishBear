import { NextRequest } from "next/server";

/**
 * 로그인 시스템 없이, 방을 만들 때 발급한 비밀 토큰(ownerToken)을
 * 프론트가 localStorage에 저장했다가 수정 요청마다 헤더로 실어 보내는 방식.
 * 헤더명: x-owner-token
 */
export function getOwnerTokenFromRequest(request: NextRequest): string | null {
  return request.headers.get("x-owner-token");
}
