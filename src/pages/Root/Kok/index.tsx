import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useNaviStore from 'contexts/naviStore';

import styles from './Kok.module.css';
import checkIcon from 'assets/img/kokList/check.svg';
import Header from 'components/Header';
import BottomBtn from 'components/BottomBtn';
import { ReactComponent as PenIcon } from 'assets/img/kokList/pen.svg';

import properties from 'models/properties';
import PropertyItem from 'components/PropertyItem';

export const Kok = () => {
  const navigate = useNavigate();

  // 하단 내비게이션 바 설정
  const { setNaviMenu, setShowNaviBar } = useNaviStore();
  useEffect(() => {
    setNaviMenu('kok');
    setShowNaviBar(true);
  }, []);

  return (
    <div className={styles.root}>
      <div className="top">
        <Header title="콕리스트" titleIcon={checkIcon} />
      </div>

      <div className={styles.propertyContainer}>
        {properties.map((property) => (
          <PropertyItem
            key={property.id}
            id={property.id}
            like={property.like}
            type={property.type}
            priceType={property.priceType}
            price={property.price}
            maintenanceFee={property.maintenanceFee}
            address={property.address}
            propertyName={property.propertyName}
            imageUrl={property.imageUrl}
            kokList={property.kokList}
          />
        ))}
      </div>

      <BottomBtn
        text="새 콕리스트 작성"
        onClick={() => navigate('./newKok/propertyList')}
        icon={<PenIcon />}
        style={{ bottom: '64px' }}
      />
    </div>
  );
};
