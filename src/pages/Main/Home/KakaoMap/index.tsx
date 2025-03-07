import { useEffect, useState } from 'react';

import { getDirection } from 'apis';
import floating from 'assets/img/pinIcon/floating.svg';
import selectedFloating from 'assets/img/pinIcon/floating_selected.svg';
import pinIcon from 'assets/img/pinIcon/pin.svg';
import position from 'assets/img/pinIcon/positon.svg';
import spot from 'assets/img/pinIcon/spot.svg';

import styles from './KakaoMap.module.css';

import type { Pin } from 'interface/Pin';
import type { HouseType } from 'types/HouseType';
import type { PriceType } from 'types/PriceType';

declare global {
  interface Window {
    kakao: any;
  }
}
interface mapLocationInfo {
  southWestLat?: number;
  southWestLon?: number;
  northEastLat?: number;
  northEastLon?: number;
}

export interface realEstateInfo {
  realEstateId: number;
  imageURL: string;
  deposit: number;
  price: number;
  transactionType: PriceType;
  realEstateType: HouseType;
  address: string;
  detailAddress: string;
  latitude: number;
  longitude: number;
  agent: string;
  isZimmed: boolean;
  isKokked: boolean;
}
interface KakaoMapProps {
  lat?: number;
  lng?: number;
  mapLocationInfo: mapLocationInfo;
  setMapLocationInfo: React.Dispatch<React.SetStateAction<mapLocationInfo>>;
  realEstatesInfo?: realEstateInfo[];
  pins?: Pin[];
  selectedProprety: realEstateInfo | null;
  setSelectedProperty: React.Dispatch<
    React.SetStateAction<realEstateInfo | null>
  >;
  selectedPin: Pin | null;
  setSelectedPin: React.Dispatch<React.SetStateAction<Pin | null>>;
}

const KakaoMap = ({
  lat,
  lng,
  mapLocationInfo,
  setMapLocationInfo,
  realEstatesInfo,
  pins,
  selectedProprety,
  setSelectedProperty,
  selectedPin,
  setSelectedPin,
}: KakaoMapProps) => {
  const [map, setMap] = useState<any>();
  const [showPins, setShowPins] = useState(false);
  const [coord, setCoord] = useState<[number, number]>();
  const [estateMakers, setEstateMarkers] = useState<any[]>([]);
  const [pinMarkers, setPinMarkers] = useState<any[]>([]);
  const [lines, setLines] = useState<any[]>([]);
  const [overlays, setOverlays] = useState<any[]>([]);

  // coord가 변경될 때마다 지도의 중심을 변경
  useEffect(() => {
    if (map === undefined) return;
    if (coord === undefined) return;

    const currentPos = new window.kakao.maps.LatLng(coord[0], coord[1]);
    map.panTo(currentPos);
  }, [map, coord]);

  // 전달된 lat 및 lng가 없을 시
  useEffect(() => {
    if (lat === undefined || lng === undefined) {
      getCurrentPosBtn();
    }
  }, []);

  // 1) 지도 생성
  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(lat ?? 0, lng ?? 0),
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

  // 3) 정상적으로 현재위치 가져올 경우 실행
  const getPosSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;
    setCoord([latitude, longitude]);
  };

  // 4) 지도 이벤트 리스너 추가
  useEffect(() => {
    if (map === undefined) return;

    const handleIdle = () => {
      // bounds 정보 업데이트
      const bounds = map.getBounds();
      const southWestLat = bounds.ha;
      const southWestLon = bounds.qa;
      const northEastLat = bounds.oa;
      const northEastLon = bounds.pa;

      setMapLocationInfo({
        southWestLon,
        southWestLat,
        northEastLon,
        northEastLat,
      });

      // 마커 업데이트
      const markerImage = new window.kakao.maps.MarkerImage(
        spot,
        new window.kakao.maps.Size(24, 35),
      );

      setEstateMarkers((prev) => {
        prev.forEach((marker) => marker.setMap(null));

        return (
          realEstatesInfo?.map((realEstateInfo) => {
            const position = new window.kakao.maps.LatLng(
              realEstateInfo.longitude,
              realEstateInfo.latitude,
            );
            const marker = new window.kakao.maps.Marker({
              opacity:
                !selectedProprety ||
                selectedProprety?.realEstateId === realEstateInfo.realEstateId
                  ? 1
                  : 0.5,
              title: realEstateInfo.realEstateId.toString(),
              map: map,
              position: position,
              image: markerImage,
            });
            window.kakao.maps.event.addListener(marker, 'click', () => {
              setSelectedPin(null);
              setSelectedProperty(realEstateInfo);
            });
            return marker;
          }) ?? []
        );
      });
    };

    const handleClick = () => {
      setSelectedProperty(null);
      setSelectedPin(null);
    };

    window.kakao.maps.event.addListener(map, 'idle', handleIdle);
    window.kakao.maps.event.addListener(map, 'click', handleClick);

    // 컴포넌트가 언마운트되면 이벤트 리스너 제거
    return () => {
      window.kakao.maps.event.removeListener(map, 'idle', handleIdle);
      window.kakao.maps.event.removeListener(map, 'click', handleClick);
    };
  }, [map, realEstatesInfo]);

  // 5) 핀 마커 추가
  useEffect(() => {
    if (map === undefined) return;
    if (!showPins) {
      pinMarkers.forEach((marker) => {
        marker.setMap(null);
      });
      return;
    }

    const pinImage = new window.kakao.maps.MarkerImage(
      pinIcon,
      new window.kakao.maps.Size(48, 48),
    );

    setPinMarkers(
      pins?.map((pin) => {
        const position = new window.kakao.maps.LatLng(
          pin.address.x,
          pin.address.y,
        );
        const marker = new window.kakao.maps.Marker({
          opacity: !selectedPin || selectedPin?.id === pin.id ? 1 : 0.5,
          title: pin.id.toString(),
          map: map,
          position: position,
          image: pinImage,
        });
        window.kakao.maps.event.addListener(marker, 'click', () => {
          setSelectedProperty(null);
          setSelectedPin(pin);
        });
        return marker;
      }) ?? [],
    );

    return () =>
      pinMarkers.forEach((marker) => {
        marker.setMap(null);
      });
  }, [map, showPins, pins]);

  useEffect(() => {
    if (map === undefined) return;

    // 마커 투명도 업데이트
    estateMakers.forEach((marker) => {
      if (
        !selectedProprety ||
        marker.getTitle() === selectedProprety?.realEstateId.toString()
      )
        marker.setOpacity(1);
      else marker.setOpacity(0.5);
    });

    pinMarkers.forEach((marker) => {
      if (!selectedPin || marker.getTitle() === selectedPin?.id.toString())
        marker.setOpacity(1);
      else marker.setOpacity(0.5);
    });

    // 라인 및 오버레이 삭제
    lines.forEach((line) => line.setMap(null));
    overlays.forEach((overlay) => overlay.setMap(null));

    // 길찾기
    if (selectedProprety !== null && showPins) {
      pins?.forEach((pin) => {
        // 핀이 화면 내에 없으면 길찾기를 하지 않음
        if (
          pin.address.y < (mapLocationInfo?.southWestLat ?? 0) ||
          pin.address.y > (mapLocationInfo?.northEastLat ?? 0) ||
          pin.address.x < (mapLocationInfo?.southWestLon ?? 0) ||
          pin.address.x > (mapLocationInfo?.northEastLon ?? 0)
        )
          return;

        getDirection(
          {
            name: selectedProprety.address,
            x: selectedProprety.latitude,
            y: selectedProprety.longitude,
          },
          {
            name: pin.name,
            x: pin.address.y,
            y: pin.address.x,
          },
        ).then((res) => {
          const path: any[] = [];

          res.routes[0].sections[0].roads.forEach((road) => {
            for (let i = 0; i < road.vertexes.length; i += 2) {
              path.push(
                new window.kakao.maps.LatLng(
                  road.vertexes[i + 1],
                  road.vertexes[i],
                ),
              );
            }
          });
          path.push(new window.kakao.maps.LatLng(pin.address.x, pin.address.y));

          const overlay = new window.kakao.maps.CustomOverlay({
            map: map,
            position: path[Math.floor(path.length / 2)],
            content: `<div class="${styles.overlay}">
                ${Math.floor(
                  (res.routes[0].summary.distance / 1000 / 4.5) * 60,
                )}분
              </div>`,
          });

          setOverlays((prev) => [...prev, overlay]);

          const polyline = new window.kakao.maps.Polyline({
            map: map,
            path: path,
            strokeWeight: 4,
            strokeColor: '#FA4549',
            strokeStyle: 'solid',
            opacity: 1,
          });

          setLines((prev) => [...prev, polyline]);
        });
      });
    }
  }, [map, showPins, selectedProprety, selectedPin, realEstatesInfo]);

  useEffect(() => {
    if (!showPins) setSelectedPin(null);
  }, [showPins]);

  return (
    <div className={styles.root}>
      <div className={styles.map} id="map"></div>
      <div className={styles.BtnCtn}>
        <button className="imgBtn" onClick={() => setShowPins((prev) => !prev)}>
          <img src={showPins ? selectedFloating : floating} />
        </button>
        <button className="imgBtn" onClick={getCurrentPosBtn}>
          <img src={position} />
        </button>
      </div>
    </div>
  );
};

export default KakaoMap;
