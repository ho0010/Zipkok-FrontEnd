import React, { memo } from 'react';

import offIcon from 'assets/img/fill/off.svg';
import onIcon from 'assets/img/fill/on.svg';
import dragIcon from 'assets/img/line(1)/drag.svg';

import styles from './CheckListCategory.module.css';

export interface CheckListCategoryProps {
  name: string;
  enabled: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

export default function CheckListCategory({
  name,
  enabled = true,
  children,
  onClick,
}: CheckListCategoryProps) {
  return (
    <div className={styles.container}>
      <div className={`${styles.header} ${!enabled ? styles.disabled : ''}`}>
        <div className={styles.headerLeft}>
          <button className="imgBtn" onClick={onClick}>
            <img src={enabled ? onIcon : offIcon}></img>
          </button>
          <span>{name}</span>
        </div>
        <div className={'drag'}>
          <img src={dragIcon} draggable={false}></img>
        </div>
      </div>
      <div className={styles.checkListContainer}>{children}</div>
    </div>
  );
}
