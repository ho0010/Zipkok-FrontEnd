import React from 'react';

import styles from './IconBtn.module.css';

type IconBtnLayout = 'vertical' | 'horizontal';

interface IconBtnProps {
  image: string;
  text: string;
  onClick?: () => void;
  layout?: IconBtnLayout;
  padding?: string;
  height?: string;
  gap?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  fontStyle?: string;
  fontWeight?: string;
}

const IconBtn = ({
  image,
  text,
  onClick,
  layout,
  padding,
  height,
  gap,
  color,
  fontFamily,
  fontSize,
  fontStyle,
  fontWeight,
}: IconBtnProps) => {
  const style = {
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    padding,
    height,
    gap,
    color,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
  } as React.CSSProperties;

  return (
    <button className={styles.btn} onClick={onClick} style={style}>
      <img src={image} />
      {text}
    </button>
  );
};

export default IconBtn;
