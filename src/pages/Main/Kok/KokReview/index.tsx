import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { getKokReview, putKok, postKok } from 'apis';
import { UserKokOption } from 'apis/user/getUserKokOption';
import BottomBtn from 'components/common/BottomBtn';
import StarRating from 'components/kok/StarRating';
import useModal from 'contexts/modalStore';
import useUIStore from 'contexts/uiStore';
import Tags from 'model/Review';

import styles from './KokReview.module.css';
import { saveKok } from './saveKok';

import type { KokConfigResult } from 'apis/kok/getKokConfig';
import type { KokReview } from 'apis/kok/getKokReview';

export default function KokReview() {
  const { state } = useLocation();
  const { kokConfig } = state as { kokConfig: KokConfigResult };
  const navigate = useNavigate();

  const realEstateId = new URLSearchParams(location.search).get('realEstateId');
  const kokId = new URLSearchParams(location.search).get('kokId');
  const starRatingLabels = ['시설', '인프라', '구조', '분위기'];

  const ui = useUIStore();
  const modal = useModal();

  const prepareOptions = (options: UserKokOption[]) =>
    options
      .filter((option) => option.isVisible)
      .map((option) => ({
        optionId: option.optionId,
        checkedDetailOptionIds: option.detailOptions
          .filter((detailOption) => detailOption.detailOptionIsVisible)
          .map((detail) => detail.detailOptionId),
      }));

  const [review, setReview] = useState<KokReview>({
    impressions: [],
    facilityStarCount: 5,
    infraStarCount: 5,
    structureStarCount: 5,
    vibeStarCount: 5,
    reviewText: '',
  });

  useEffect(() => {
    ui.setUI({
      naviEnabled: false,
      headerEnabled: true,
      headerTitle: '발품 후기',
      headerBackButtonEnabled: true,
      headerRightButtons: [],
      path: 'kok',
    });

    if (kokId) {
      getKokReview(parseInt(kokId)).then((res) => {
        setReview(res.result);
      });
    }
  }, [kokId, ui]);

  const handleSave = async () => {
    if (kokConfig === undefined) return;

    const getFile = async (url: string, prefix: string) =>
      new File(
        [await (await fetch(url)).blob()],
        `${prefix}${Math.random().toString(36).substring(2, 12)}.jpg`,
        {
          type: 'image/jpeg',
        },
      );

    const pictureData = await Promise.all([
      ...(kokConfig.outerImageUrls?.map((url) => getFile(url, 'OUTTER')) ?? []),
      ...(kokConfig.innerImageUrls?.map((url) => getFile(url, 'INNER')) ?? []),
      ...(kokConfig.contractImageUrls?.map((url) => getFile(url, 'CONTRACT')) ??
        []),
    ]);

    const outerOptions = prepareOptions(kokConfig.outerOptions);
    const innerOptions = prepareOptions(kokConfig.innerOptions);
    const contractOptions = prepareOptions(kokConfig.contractOptions);

    saveKok({
      kokId,
      realEstateId,
      kokConfig,
      review,
      outerOptions,
      innerOptions,
      contractOptions,
      pictureData,
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.reviews}>
        {/* <div className={styles.image}>
          <SwiperCom imageUrls={[]}></SwiperCom>
        </div> */}
        <div>
          <div className={styles.review}>
            <h1
              className={styles.textLabel}
              style={{ marginBottom: '17px', marginTop: '25px' }}
            >
              집의 첫인상이 어땠나요?
            </h1>
            <div>
              <div className={styles.tags}>
                {Tags.map((tag) => (
                  <button
                    key={tag}
                    className={
                      review?.impressions.includes(tag)
                        ? styles.tagSelected
                        : styles.tag
                    }
                    onClick={() =>
                      setReview((prev) => ({
                        ...prev,
                        impressions: prev?.impressions.includes(tag)
                          ? prev?.impressions.filter(
                              (impression) => impression !== tag,
                            )
                          : [...(prev?.impressions || []), tag],
                      }))
                    }
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.review}>
            <h1
              className={styles.textLabel}
              style={{ marginBottom: '28px', marginTop: '45px' }}
            >
              매물은 어떠셨나요?
            </h1>
            {starRatingLabels.map((label, index) => (
              <StarRating
                key={label}
                label={label}
                starCount={review[`${label}StarCount`] || 0}
                setStarCount={(starCount) =>
                  setReview((prev) => ({
                    ...prev,
                    [`${label}StarCount`]:
                      typeof starCount === 'function'
                        ? starCount(prev[`${label}StarCount`] || 0) //동적 문자열로 하려고 하면 컴파일 시점에 해당 속성이 존재하는지 알 수 없다.
                        : starCount,
                  }))
                }
              />
            ))}
          </div>
          <div className={styles.review}>
            <textarea
              placeholder="매물에 대한 후기를 자유롭게 남겨보세요."
              value={review?.reviewText}
              onChange={(e) =>
                setReview((prev) => ({
                  ...prev,
                  reviewText: e.target.value,
                }))
              }
            ></textarea>
          </div>
        </div>
      </div>
      <BottomBtn
        anchorText="건너뛰기"
        onAnchorClick={() => navigate('/kok/complete')}
        text="저장하기"
        onClick={handleSave}
        occupySpace
      />
    </div>
  );
}
