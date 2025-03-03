import { create } from 'zustand';

import type { Address } from 'interface/Address';
import type { HouseType } from 'types/HouseType';
import type { PriceType } from 'types/PriceType';

export interface CustomKokStore {
  pictures?: string[];
  address: Address;
  memo?: string;
  deposit?: number;
  monthlyPrice?: number;
  price?: number;
  maintanenceFee?: number;
  detailAddress?: string;
  area?: number;
  floor?: number;
  houseType: HouseType;
  priceType: PriceType;
  nickName?: string;

  setPictures: (pictures?: string[]) => void;
  setAddress: (address: Address) => void;
  setMemo: (memo?: string) => void;
  setDeposit: (deposit?: number) => void;
  setMonthlyPrice: (monthlyPrice?: number) => void;
  setPrice: (price?: number) => void;
  setMaintanenceFee: (maintanenceFee?: number) => void;
  setDetailAddress: (detailAddress?: string) => void;
  setArea: (area?: number) => void;
  setFloor: (floor?: number) => void;
  setHouseType: (houseType: HouseType) => void;
  setPriceType: (priceType: PriceType) => void;
  setNickName: (nickName?: string) => void;
}

const initialState: CustomKokStore = {
  address: {
    address_name: '',
    x: 0,
    y: 0,
  },
  memo: undefined,
  deposit: undefined,
  monthlyPrice: undefined,
  price: undefined,
  maintanenceFee: undefined,
  detailAddress: undefined,
  area: undefined,
  floor: undefined,
  houseType: 'ONEROOM',
  priceType: 'MONTHLY',
  nickName: undefined,

  setPictures: () => {},
  setAddress: () => {},
  setMemo: () => {},
  setDeposit: () => {},
  setMonthlyPrice: () => {},
  setPrice: () => {},
  setMaintanenceFee: () => {},
  setDetailAddress: () => {},
  setArea: () => {},
  setFloor: () => {},
  setHouseType: () => {},
  setPriceType: () => {},
  setNickName: () => {},
};

const useCustomKokStore = create<CustomKokStore>((set) => ({
  ...initialState,
  setPictures: (pictures) => set({ pictures }),
  setAddress: (address) => set({ address }),
  setMemo: (memo) => set({ memo }),
  setDeposit: (deposit) => set({ deposit }),
  setMonthlyPrice: (monthlyPrice) => set({ monthlyPrice }),
  setPrice: (price) => set({ price }),
  setMaintanenceFee: (maintanenceFee) => set({ maintanenceFee }),
  setDetailAddress: (detailAddress) => set({ detailAddress }),
  setArea: (area) => set({ area }),
  setFloor: (floor) => set({ floor }),
  setHouseType: (houseType) => set({ houseType }),
  setPriceType: (priceType) => set({ priceType }),
  setNickName: (nickName) => set({ nickName }),
}));

export default useCustomKokStore;
