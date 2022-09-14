/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
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

  const { state: swapApprovedState, send: swapApprovedSend } = useContractFunction(fromTokenContract, 'approve', {
    transactionName: 'onApproveRequested',
    gasLimitBufferPercentage: 10,
  });

  const { state: swapExecuteState, send: swapAExecuteSend } = useContractFunction(
    routerContract,
    'swapExactTokensForTokens',
    {
      transactionName: 'swapExactTokensForTokens',
      gasLimitBufferPercentage: 10,
    }
  );

  const isApproving = isOperationPending(swapApprovedState),
    isSwapping = isOperationPending(swapExecuteState);
  const canApprove = !isApproving && approveNeeded,
    canSwap = !approveNeeded && !isSwapping && formValueIsGreaterThan0 && hasEnoughBalance;

  const successMessage = getSuccessMessage(swapApprovedState, swapExecuteState),
    failureMessage = getFailureMessage(swapApprovedState, swapExecuteState);

  // console.log('ONE', { account, fromValue, fromToken, toToken, resetState });
  // console.log('TWO', { fromValueBigNumber, availableTokens, counterpartTokens, pairAddress });
  // console.log('THREE', { routerContract, fromTokenContract, fromTokenBalance, toTokenBalance, tokenAllowance, approveNeeded, formValueIsGreaterThan0, hasEnoughBalance, });
  // console.log('FOUR', { swapApprovedState, swapApprovedSend });
  // console.log('FIVE', { swapExecuteState, swapAExecuteSend });
  // console.log('SIX', { isApproving, isSwapping, canApprove, canSwap });
  // console.log('SEVEN', { successMessage, failureMessage });

  const onApproveRequested = () => {
    swapApprovedSend(ROUTER_ADDRESS, ethers.constants.MaxInt256);
  };

  const onSwapRequested = () => {
    swapAExecuteSend(fromValueBigNumber, 0, [fromToken, toToken], account, Math.floor(Date.now() / 1000) + 60 * 2)
      .then(() => { setFromValue('0'); });
  };

  const onFromValueChange = (value) => {
    const trimmedValue = value.trim();
    try {
      if (trimmedValue) parseUnits(value);
      setFromValue(value);
    } catch (error) {
      console.error(error);
    }
  };

  const onFromTokenChange = (value) => {
    setFromToken(value);
  }

  const onToTokenChange = (value) => {
    setToToken(value);
  };

  useEffect(() => {
    if (failureMessage || successMessage) {
      setTimeout(() => {
        setResetState(true);
        setFromValue('0');
        setToToken('');
      }, 5000)
    }
  }, [failureMessage, successMessage])
  

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
