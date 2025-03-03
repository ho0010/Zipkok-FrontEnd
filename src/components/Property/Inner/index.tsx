import React from 'react';

import { OptionsComponent, Furnitures, TextInput } from 'components';

import styles from './Inner.module.css';

import type { UserKokOption } from 'apis/user/getUserKokOption';

interface InnerProps {
  furnitureOptions: string[];
  direction: string;
  options: UserKokOption[];
  setOptions?: React.Dispatch<React.SetStateAction<UserKokOption[]>>;
}

export default function Inner({
  furnitureOptions,
  direction,
  options,
  setOptions,
}: InnerProps) {
  const filteredFurnitures = Furnitures.filter((furniture) =>
    furnitureOptions.includes(furniture.name),
  );
  console.log(direction);
  return (
    <>
      {/* 가구 옵션 */}
      <div className={styles.furnitureCtn}>
        {filteredFurnitures.map((tag, index) => (
          <div className={styles.furniture} key={index}>
            <img src={tag.img} />
            {tag.name}
          </div>
        ))}
      </div>

      {/* 방향 */}
      <div className={styles.header}>
        <span className={styles.title}>집 방향</span>
      </div>
      <div className={styles.directionContainer}>
        <TextInput value={direction} style={'roundedBox'} readOnly />
      </div>

      {/* 체크리스트 */}
      <div className={styles.optionContainer}>
        <OptionsComponent
          kokOptions={options}
          setKokOptions={setOptions}
          readOnly={true}
        />
      </div>
    </>
  );
}
