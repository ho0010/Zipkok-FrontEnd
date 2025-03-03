import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import backIcon from 'assets/img/line(2)/left_arrow.svg';
import useAddressStore from 'contexts/addressStore';
import useUIStore from 'contexts/uiStore';
import useAddressSearch from 'hooks/useAddressSearch';

import RecentAddress from './components/RecentAddress';
import styles from './Search.module.css';

import type { Address } from 'interface/Address';

export interface AddressHistory {
  id: number;
  address: Address;
  date: string;
}

export default function Search() {
  const { setAddress } = useAddressStore();

  const [searched, setSearched] = useState(false);

  const ui = useUIStore();
  const [recentSearch, setRecentSearch] = useState<AddressHistory[]>(
    JSON.parse(localStorage.getItem('recentSearch') || '[]'),
  );

  useEffect(() => {
    ui.setUI({
      naviEnabled: false,
      headerEnabled: false,
      headerTitle: '',
      headerBackButtonEnabled: false,
      headerRightButtons: [],
      path: 'home',
    });
  }, []);

  const navigate = useNavigate();

  function handleAddressClick(address: Address) {
    localStorage.setItem(
      'recentSearch',
      JSON.stringify([
        {
          id: Math.random().toString(16),
          address,
          date: `${new Date().getMonth() + 1}. ${new Date().getDate()}.`,
        },
        ...recentSearch,
      ]),
    );

    setAddress(address, 'home_search');
    navigate(-1);
  }

  function handleRecentClick(history: AddressHistory) {
    localStorage.setItem(
      'recentSearch',
      JSON.stringify([
        {
          ...history,
          date: `${new Date().getMonth() + 1}. ${new Date().getDate()}.`,
        },
        ...recentSearch.filter((item) => item.id !== history.id),
      ]),
    );

    setAddress(history.address, 'home_search');
    navigate(-1);
  }

  const [, addressCount, AddressSeachInput, AddressSearchResult, handleSubmit] =
    useAddressSearch(handleAddressClick);

  return (
    <div className={styles.root}>
      {/* 검색 상자 */}
      <div className={styles.top}>
        <Link to="/">
          <button className="imgBtn">
            <img src={backIcon}></img>
          </button>
        </Link>
        <AddressSeachInput
          style="none"
          placeholder="어느 지역의 매물을 찾고 계신가요?"
          onSubmit={() => {
            handleSubmit();
            setSearched(true);
          }}
        />
      </div>

      <div className={styles.body}>
        {/* 최근 검색 */}
        {!searched && (
          <>
            <div className={styles.title}>최근 검색</div>
            <div className={styles.addressContainer}>
              {recentSearch.length === 0 && (
                <div className={styles.message}>
                  최근 검색 결과가 없어요.
                  <br />
                  주소를 입력해서 검색해주세요.
                </div>
              )}

              {recentSearch.map((history) => (
                <RecentAddress
                  history={history}
                  onClick={handleRecentClick}
                  setRecentSearch={setRecentSearch}
                  key={history.id}
                />
              ))}
            </div>
          </>
        )}

        {/* 검색 결과 */}
        {searched && (
          <>
            <div className={styles.title}>
              {addressCount.toLocaleString()}건의 검색 결과
            </div>
            <div className={styles.addressContainer}>
              <AddressSearchResult />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
