import Cookies from 'js-cookie';
import storeNewTokensToCookie from 'utils/storeNewTokensToCookie';

import type { ZipkokResponse } from 'interface/ZipkokResponse';
interface postKokInfo {
  kokId: number;
}

/**
 * `POST /kok`으로 매물 등록을 요청합니다.
 */

export async function postKok(
  realEstateId: number,
  checkedHighlights: string[],
  checkedFurnitureOptions: string[],
  direction: string,
  reviewInfo: {
    checkedImpressions: string[];
    facilityStarCount: number;
    infraStarCount: number;
    structureStarCount: number;
    vibeStarCount: number;
    reviewText: string;
  },
  checkedOuterOptions: {
    optionId: number;
    checkedDetailOptionIds: number[];
  }[],
  checkedInnerOptions: {
    optionId: number;
    checkedDetailOptionIds: number[];
  }[],
  checkedContractOptions: {
    optionId: number;
    checkedDetailOptionIds: number[];
  }[],
  files?: File[],
) {
  const formData = new FormData();
  files?.forEach((file) => formData.append('file', file, file.name));
  formData.append(
    'data',
    new Blob(
      [
        JSON.stringify({
          realEstateId,
          checkedHighlights,
          checkedFurnitureOptions,
          direction,
          reviewInfo,
          checkedOuterOptions,
          checkedInnerOptions,
          checkedContractOptions,
        }),
      ],
      {
        type: 'application/json',
      },
    ),
  );

  let accessToken = Cookies.get('accessToken');

  // access token 만료 시
  if (accessToken === undefined) {
    accessToken = await storeNewTokensToCookie().then((res) => {
      if (res === null) throw new Error('로그인이 필요합니다.');
      return res.accessToken;
    });
  }

  const res = (await fetch('http://192.168.0.53:9000/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  }).then((res) => res.json())) as ZipkokResponse<postKokInfo>;
  return res;
}
