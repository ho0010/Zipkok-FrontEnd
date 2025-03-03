import api from '../';

import type { KokOption } from 'interface/KokOption';
import type { ZipkokResponse } from 'interface/ZipkokResponse';

export type UserKokOption = Omit<KokOption, 'id'> & { optionId: number };

interface GetUserKokOptionResponse<T> {
  highlights: string[];
  outerOptions: T[];
  innerOptions: T[];
  contractOptions: T[];
}

/**
 * `GET /user/kokOption`
 * 마이페이지의 리스트 항목 수정을 눌렀을 때 호출되는 API
 * @returns 유저의 콕 옵션 정보
 */
export async function getUserKokOption() {
  const path = '/user/kokOption';
  const method = 'GET';
  const params = {};
  const authRequired = true;

  const res = await api<
    ZipkokResponse<GetUserKokOptionResponse<UserKokOption>>
  >(path, method, authRequired, params, undefined, undefined);

  res.result.outerOptions = res.result.outerOptions.sort(
    (a, b) => a.orderNumber - b.orderNumber,
  );
  res.result.innerOptions = res.result.innerOptions.sort(
    (a, b) => a.orderNumber - b.orderNumber,
  );
  res.result.contractOptions = res.result.contractOptions.sort(
    (a, b) => a.orderNumber - b.orderNumber,
  );

  return res;
}
