import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';

import markerIcon from 'assets/img/pinIcon/pin.svg';

import styles from './Map.module.css';

import type { Address } from 'interface/Address';

declare global {
  interface Window {
    kakao: any;
  }
}

export interface KakaoMapRef {
  getCurrentPosBtn: () => void;
}

interface KakaoMapProps {
  setAddress: (address: Address) => void;
  defaultAddress?: Address;
}

const KakaoMap = forwardRef<KakaoMapRef, KakaoMapProps>(
  ({ setAddress, defaultAddress }: KakaoMapProps, ref) => {
    const [map, setMap] = useState<any>();
    const [coord, setCoord] = useState<[number, number]>();

    const geocoder = new kakao.maps.services.Geocoder();

    // coord가 변경될 때마다 지도의 중심을 변경
    useEffect(() => {
      if (map === undefined) return;
      if (coord === undefined) return;

      const currentPos = new window.kakao.maps.LatLng(coord[0], coord[1]);
      map.panTo(currentPos);
    }, [map, coord]);

    // 전달된 address가 없을 시
    useEffect(() => {
      if (defaultAddress === undefined) getCurrentPosBtn();
    }, []);

    // 1) 지도 생성
    useEffect(() => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(
            defaultAddress?.x ?? 37.5665,
            defaultAddress?.y ?? 126.978,
          ),
          level: 3,
        };

        setMap(new window.kakao.maps.Map(container, options));
      });
    }, []);

    // 2) 현재 위치 함수
    const getCurrentPosBtn = () => {
      navigator.geolocation.getCurrentPosition(
        getPosSuccess,
        () => {
          // 현재 위치 가져오기 실패 시 서울로 이동
          setCoord([37.5665, 126.978]);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000,
        },
      );
    };

    useImperativeHandle(ref, () => ({
      getCurrentPosBtn,
    }));

    // 3) 정상적으로 현재위치 가져올 경우 실행
    const getPosSuccess = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      setCoord([latitude, longitude]);
    };

    useEffect(() => {
      if (map === undefined) return;

      const markerImage = new window.kakao.maps.MarkerImage(
        markerIcon,
        new window.kakao.maps.Size(48, 48),
      );

      const marker = new window.kakao.maps.Marker({
        map: map,
        position: new window.kakao.maps.LatLng(37.5665, 126.978),
        image: markerImage,
      });

      const centerChangeHandler = () => {
        const center = map.getCenter();
        marker.setPosition(center);
      };
      centerChangeHandler();

      const idleHandler = () => {
        const center = map.getCenter();
        geocoder.coord2Address(
          center.getLng(),
          center.getLat(),
          (result: any) => {
            setAddress({
              address_name:
                result[0]?.address?.address_name ?? '등록되지 않은 주소',
              x: center.getLat(),
              y: center.getLng(),
            });
          },
        );
      };
      idleHandler();

      // 이벤트 리스너 추가
      window.kakao.maps.event.addListener(
        map,
        'center_changed',
        centerChangeHandler,
      );
      window.kakao.maps.event.addListener(map, 'idle', idleHandler);

      // 컴포넌트가 언마운트되면 이벤트 리스너 제거
      return () => {
        window.kakao.maps.event.removeListener(
          map,
          'center_changed',
          centerChangeHandler,
        );
        window.kakao.maps.event.removeListener(map, 'idle', idleHandler);
      };
    }, [map]);

    return <div className={styles.map} id="map"></div>;
  },
);

export default KakaoMap;
