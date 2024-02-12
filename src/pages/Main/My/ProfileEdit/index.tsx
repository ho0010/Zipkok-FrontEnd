import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getProfileEditInfo } from 'apis';
import { ProfileEditInfo } from 'apis/getProfileEditInfo';
import searchIcon from 'assets/img/line(2)/search.svg';
import { TextInput, BottomBtn } from 'components';
import useAddressStore from 'contexts/addressStore';
import useUIStore from 'contexts/uiStore';
import useBirthInput from 'hooks/useBirthInput';
import useRadioBtn from 'hooks/useRadioBtn';

import styles from './ProfileEdit.module.css';
import Jeonse from '../../../Onboarding/Price/priceSlider/Jeonse';
import Monthly from '../../../Onboarding/Price/priceSlider/Monthly';
import Purchase from '../../../Onboarding/Price/priceSlider/Purchase';
import { Gender } from '../../../SignIn';

import type { HouseType } from 'types/HouseType';
import type { PriceType } from 'types/PriceType';

type PriceRange = [number, number];

const ProfileEdit = () => {
  const ui = useUIStore();
  const [profileEditInfo, setProfileEditInfo] = useState<ProfileEditInfo>();
  useEffect(() => {
    getProfileEditInfo().then((res) => setProfileEditInfo(res.result));
    console.log(profileEditInfo);
    if (profileEditInfo?.imageUrl !== undefined) {
      setImgSrc(profileEditInfo?.imageUrl);
    }

    ui.setUI((state) => ({
      ...state,
      headerTitle: '프로필 수정하기',
      headerIcon: undefined,
      headerBackButtonEnabled: true,
      naviEnabled: false,
    }));
  }, []);

  // 성별 라디오 버튼
  const genderOptions: { value: Gender; content: string }[] = [
    { value: '남자', content: '남' },
    { value: '여자', content: '여' },
    { value: '비공개', content: '비공개' },
  ];
  const [GenderRadioBtnContainer, gender] = useRadioBtn<Gender>(
    genderOptions,
    'round',
    '남자',
  );

  // 집 형태 라디오 버튼
  const houseTypeOptions: { value: HouseType; content: string }[] = [
    { value: '원룸', content: '원룸' },
    { value: '오피스텔', content: '오피스텔' },
    { value: '아파트', content: '아파트' },
    { value: '빌라/투룸', content: '빌라/투룸' },
  ];
  const [HouseTypeRadioBtnContainer, houseType] = useRadioBtn<HouseType>(
    houseTypeOptions,
    'tag',
    '원룸',
  );

  // 가격 타입 라디오 버튼
  const priceTypeOptions: { value: PriceType; content: string }[] = [
    { value: '월세', content: '월세' },
    { value: '전세', content: '전세' },
    { value: '매매', content: '매매' },
  ];
  const [PriceTypeRadioBtnContainer, priceType] = useRadioBtn<PriceType>(
    priceTypeOptions,
    'tag',
    '월세',
  );

  const [imgSrc, setImgSrc] = useState('');
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [BirthInput, , , birthWarningMsg] = useBirthInput();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const address = useAddressStore((state) => state.address);

  const defaultValues: Record<PriceType, PriceRange[]> = {
    월세: [
      [0, 60_000_000],
      [0, 400_000],
    ],
    전세: [[0, 60_000_000]],
    매매: [[0, 120_000_000]],
  };

  const navigate = useNavigate();
  const handleConfirmClick = () => {
    navigate(-1);
  };

  // 이미지 누르면 파일 업로드 로직
  const fileChange = async (fileBlob: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);

    await new Promise<void>((resolve) => {
      reader.onload = () => {
        resolve();
      };
    });

    setImgSrc(reader.result as string);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      fileChange(e.target.files[0]);
    }
  };
  const handleImgClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.body}>
        {/* 프로필 이미지 */}
        <div className={styles.imgContainer}>
          <input
            id="inputFile"
            type="file"
            name="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <img
            src={imgSrc || 'https://picpac.kr/common/img/default_profile.png'}
            onClick={handleImgClick}
          />
          <p onClick={handleImgClick}>수정하기</p>
        </div>

        {/* 닉네임 */}
        <div className={styles.inputContainer}>
          <p className={styles.title}>닉네임</p>
          <TextInput
            placeholder="최대 12자"
            defaultValue={profileEditInfo?.nickname}
            maxLength={12}
            style="roundedBox"
            captionStyle={{
              color: 'var(--primary-color-primary_default, #FA4549)',
              fontSize: '14px',
              fontWeight: '400',
            }}
          />
        </div>

        {/* 생년월일 및 성별 */}
        <div className={styles.inputContainer}>
          <p className={styles.title}>생년월일</p>

          <div className={styles.birthGenderContainer}>
            <BirthInput
              defaultValue={profileEditInfo?.birthday}
              placeholder="6자리 숫자로 입력해주세요"
              style="roundedBox"
              caption={birthWarningMsg}
              captionStyle={{
                color: 'var(--primary-color-primary_default, #FA4549)',
                fontSize: '14px',
                fontWeight: '400',
              }}
            />

            <GenderRadioBtnContainer className={styles.genderBtnContainer} />
          </div>
        </div>

        {/* 희망 거주지역 */}
        <div className={styles.inputContainer}>
          <p className={styles.title}>희망 거주지역</p>
          <TextInput
            defaultValue={address.address_name}
            icon={searchIcon}
            style="roundedBox"
            onClick={() => navigate('/my/profileEdit/locationEdit')}
            readOnly
          />
        </div>

        {/* 필터 설정 */}
        <div className={styles.inputContainer}>
          <p className={styles.title}>필터 설정</p>

          <div className={styles.filterContainers}>
            {/* 가격 타입 */}
            <PriceTypeRadioBtnContainer className={styles.filterContainer} />

            {/* 집 타입 */}
            <HouseTypeRadioBtnContainer className={styles.filterContainer} />
          </div>
        </div>

        {/* 가격 설정 */}
        <div className={styles.priceSliderContainer}>
          <div>
            {priceType === '월세' && (
              <Monthly
                onChange1={(rangeStart, rangeEnd) => {
                  setPriceRanges((prev) => [[rangeStart, rangeEnd], prev[1]]);
                }}
                onChange2={(rangeStart, rangeEnd) => {
                  setPriceRanges((prev) => [prev[0], [rangeStart, rangeEnd]]);
                }}
                defaultValues={defaultValues[priceType]}
              />
            )}

            {priceType === '전세' && (
              <Jeonse
                onChange={(rangeStart, rangeEnd) => {
                  setPriceRanges([[rangeStart, rangeEnd]]);
                }}
                defaultValues={defaultValues[priceType]}
              />
            )}

            {priceType === '매매' && (
              <Purchase
                onChange={(rangeStart, rangeEnd) => {
                  setPriceRanges([[rangeStart, rangeEnd]]);
                }}
                defaultValues={defaultValues[priceType]}
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.blank}></div>

      <BottomBtn text="수정 완료" onClick={handleConfirmClick} occupySpace />
    </div>
  );
};

export default ProfileEdit;
