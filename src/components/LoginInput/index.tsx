import React, { useRef } from 'react';
import deleteIcon from '../../assets/img/delete.svg';
import styles from './LoginInput.module.css';

interface LoginInputProps {
  value?: string;
  placeholder?: string;
  icon?: string;
  numberOnly?: boolean;
  onChange?: (e: React.FormEvent<HTMLInputElement>) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  caption?: string;
  maxLength?: number;
  ref?: React.Ref<HTMLInputElement>;
}

export default function LoginInput({
  value,
  placeholder,
  icon,
  numberOnly,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  caption,
  maxLength = 524288,
}: LoginInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    if (numberOnly) {
      const value = e.currentTarget.value;
      if (value.length > maxLength) {
        inputRef.current!.value = value.slice(0, maxLength);
      }
    }
    onChange && onChange(e);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!numberOnly) return;
    if (e.key === 'e' || e.key === '.' || e.key === '-' || e.key === '+')
      e.preventDefault();
  }

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (onSubmit) onSubmit();
    }
  }

  function handleDeleteClick() {
    if (inputRef.current) {
      inputRef.current.value = '';
      if (onChange)
        onChange({
          currentTarget: inputRef.current,
        } as React.FormEvent<HTMLInputElement>);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.textBox}>
        <input
          type={numberOnly ? 'number' : 'text'}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onFocus={onFocus}
          onBlur={onBlur}
          value={value}
          placeholder={placeholder}
          ref={inputRef}
          maxLength={maxLength}
        ></input>

        {!inputRef.current || inputRef.current.value === '' ? (
          <img src={icon}></img>
        ) : (
          <button className="imgBtn" onClick={handleDeleteClick}>
            <img src={deleteIcon}></img>
          </button>
        )}
      </div>
      {caption && <span className={styles.caption}>{caption}</span>}
    </div>
  );
}
