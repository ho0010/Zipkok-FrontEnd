import React from 'react';

import styles from './Btn.module.css';

interface BtnProps {
  onClick?: () => void;
  text: string;
  isKeyboardOpen?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const Btn = ({ onClick, text, isKeyboardOpen, disabled, icon }: BtnProps) => {
  return (
    <button
      className={`${styles.btn} ${!isKeyboardOpen ? styles.round : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};
export default Btn;
