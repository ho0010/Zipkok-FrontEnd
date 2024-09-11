import React from 'react';

import styles from './RadioBtn.module.css';

interface RadioBtnProps {
  content: string;
  isSelected: boolean;
  handleClick: () => void;
}

const RadioBtn = ({ content, isSelected, handleClick }: RadioBtnProps) => {
  const buttonStyle = isSelected ? styles.selected : styles.notSelected;

  return (
    <div className={styles.Btn}>
      <li className={`${styles.button} ${buttonStyle}`} onClick={handleClick}>
        {content}
      </li>
    </div>
  );
};

export default RadioBtn;
