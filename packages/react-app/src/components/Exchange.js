/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { abis } from '@my-app/contracts';
import { ERC20, useContractFunction, useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { ROUTER_ADDRESS } from '../config';

const Exchange = ({ pools }) => {
  return (
    <div className='flex flex-col w-full items-center'>
      <div className='mb-8'>
      </div>
    </div>
  );
};

export default Exchange;