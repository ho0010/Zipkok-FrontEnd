import React, { useRef } from 'react';

import deleteBtnIcon from 'assets/img/fill/delete.svg';
import cameraIcon from 'assets/img/line(1)/camera.svg';
import { OptionsComponent } from 'components';

import styles from './Contract.module.css';

import type { UserKokOption } from 'apis/user/getUserKokOption';
interface ContractProps {
  pictures: string[];
  setPictures: React.Dispatch<React.SetStateAction<string[]>>;
  options: UserKokOption[];
  setOptions: React.Dispatch<React.SetStateAction<UserKokOption[]>>;
}

export default function Contract({
  pictures,
  setPictures,
  options,
  setOptions,
}: ContractProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileChange = async (fileBlob: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);

    await new Promise<void>((resolve) => {
      reader.onload = () => {
        resolve();
      };
    });

    setPictures((prev) => [...prev, reader.result as string]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      fileChange(e.target.files[0]);
    }
  };

  return (
    <div className={styles.root}>
      {/* 사진 */}
      <div className={styles.pictureContainer}>
        <p>계약서 등의 사진을 찍어주세요</p>

        <div className={styles.pictures}>
          {/* 최대 사진 개수 이하인 경우에만 */}
          {pictures.length < 10 && (
            <div className={styles.picture}>
              <button
                className={styles.addPicture}
                onClick={() => fileInputRef.current?.click()}
              >
                <img src={cameraIcon} />
                <p>{pictures.length} / 10</p>
              </button>
              <input
                id="inputFile"
                type="file"
                name="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={pictures.length >= 10}
              />
            </div>
          )}

          {pictures.map((picture) => (
            <div key={picture} className={styles.picture}>
              <img src={picture} />
              <button
                className={styles.deletePicture}
                onClick={() =>
                  setPictures((prev) => prev.filter((e) => e !== picture))
                }
              >
                <img src={deleteBtnIcon} />
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* 콕리스트 */}
      <div className={styles.koklistContainer}>
        <OptionsComponent kokOptions={options} setKokOptions={setOptions} />
      </div>
    </div>
  );
}
