import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AddressSearchPage } from 'components';
import useAddressStore from 'contexts/addressStore';

export default function LocationEdit() {
  const navigate = useNavigate();
  const setAddress = useAddressStore((state) => state.setAddress);

  return (
    <AddressSearchPage
      confirmLocation={(address) => {
        setAddress(address);
        navigate(-1);
      }}
      skippable={true}
      defaultAddress=""
    />
  );
}
