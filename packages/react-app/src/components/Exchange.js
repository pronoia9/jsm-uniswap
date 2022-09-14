/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { abis } from '@my-app/contracts';
import { ERC20, useContractFunction, useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { ROUTER_ADDRESS } from '../config';
import { AmountIn, AmountOut, Balance } from '.';
import styles from '../styles';
import {
  getAvailableTokens,
  getCounterpartTokens,
  findPoolByTokens,
  isOperationPending,
  getFailureMessage,
  getSuccessMessage,
} from '../utils';

const Exchange = ({ pools }) => {
  const { account } = useEthers();
  const [fromValue, setFromValue] = useState('0');
  const [fromToken, setFromToken] = useState(pools[0].token0Address);
  const [toToken, setToToken] = useState('');
  const [resetState, setResetState] = useState(false);

  const fromValueBigNumber = parseUnits(fromValue);
  const availableTokens = getAvailableTokens(pools);
  const counterpartTokens = getCounterpartTokens(pools, fromToken);
  const pairAddress = findPoolByTokens(pools, fromToken, toToken)?.address ?? '';

  const routerContract = new Contract(ROUTER_ADDRESS, abis.router02);
  const fromTokenContract = new Contract(fromToken, ERC20.abi);
  const fromTokenBalance = useTokenBalance(fromToken, account);
  const toTokenBalance = useTokenBalance(toToken, account);
  const tokenAllowance = useTokenAllowance(fromToken, account, ROUTER_ADDRESS) || parseUnits('0');
  const approveNeeded = fromValueBigNumber.gt(tokenAllowance);
  const formValueIsGreaterThan0 = fromValueBigNumber.gt(parseUnits('0'));
  const hasEnoughBalance = fromValueBigNumber.lte(fromTokenBalance ?? parseUnits('0'));

  // !temp
  // const isApproving = isOperationPending('approve'), // TODO
  //   isSwapping = isOperationPending('swap'); // TODO
  // const successMessage = getSuccessMessage(), // TODO
  //   failure = getFailureMessage(); // TODO

  return (
    <div className='flex flex-col w-full items-center'>
      <div className='mb-8'>
        <AmountIn />
        <Balance />
      </div>
      <div className='mb-8 w-[100%]'>
        <AmountOut />
        <Balance />
      </div>

      {'approveNeeded' && '!isSwapping' ? (
        <button
          disabled={!'canApprove'}
          onClick={() => {}}
          className={`${'canApprove' ? 'bg-site-pink text-white' : 'bg-site-dim2 text-site-dim2'} ${
            styles.actionButton
          }`}>
          {'isApproving' ? 'Approving' : 'Approve'}
        </button>
      ) : (
        <button
          disabled={!'canSwap'}
          onClick={() => {}}
          className={`${'canSwap' ? 'bg-site-pink text-white' : 'bg-site-dim2 text-site-dim2'} ${styles.actionButton}`}>
          {'isSwapping' ? 'Swapping...' : 'hasEnoughBalance'}
        </button>
      )}

      {'failureMessage' && '!resetState' ? (
        <p className={styles.message}>failure</p>
      ) : (
        <p className={styles.message}>success</p>
      )}
    </div>
  );
};

export default Exchange;
