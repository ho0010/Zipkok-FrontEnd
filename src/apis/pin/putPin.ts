import api from '../';

import type { Pin } from 'interface/Pin';
import type { ZipkokResponse } from 'interface/ZipkokResponse';

/**
 * `PUT /pin`으로 핀 수정을 요청합니다.
 */
export const putPin = async (pin: Pin) => {
  const path = `/pin`;
  const method = 'PATCH';
  const body = {
    pin,
  };
  const authRequired = true;
  const res = await api<ZipkokResponse<undefined>>(
    path,
    method,
    authRequired,
    undefined,
    body,
    undefined,
  );
  return res;
};
