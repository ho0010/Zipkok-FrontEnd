import api from '../';

import type { ZipkokResponse } from 'interface/ZipkokResponse';
import type { Gender } from 'pages/SignIn';

interface SignInResult {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshTokenExpiresIn: number;
}

/**
 * `POST /user`으로 회원가입을 요청합니다.
 */
export async function signIn(
  nickname: string,
  oauthProvider = 'KAKAO',
  email: string,
  gender: Gender,
  birth: Date,
) {
  const path = '/user';
  const method = 'POST';
  const body = {
    nickname,
    oauthProvider,
    email,
    gender,
    birthday: birth.toISOString().slice(2, 10).replace(/-/g, ''),
  };
  const authRequired = false;

  const res = await api<ZipkokResponse<SignInResult>>(
    path,
    method,
    authRequired,
    undefined,
    body,
    undefined,
  );

  return res;
}
