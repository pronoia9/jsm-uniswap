/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';

import { chevronDown } from '../assets';
import styles from '../styles';
import { useOnClickOutside } from '../utils';

const AmountOut = ({ fromToken, toToken, amountIn, pairContract, currencyValue, onSelect, currencies }) => {
  const [showList, setShowList] = useState(false);

  return (
    <div className={styles.amountContainer}>
      <input placeholder='0.0' type='number' value='' disabled={true} className={styles.amountInput} />

      <div
        className='relative'
        onClick={() => {
          setShowList((prev) => !prev);
        }}>
        <button className={styles.currencyButton}>
          ETH
          {/* {activeCurrency} */}
          <img
            src={chevronDown}
            alt='chevron-down'
            className={`w-3 h-3 object-contain ml-2 ${showList ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>

        {showList && (
          <ul className={styles.currencyList}>
            {[
              { token: 'ETH', tokenName: 'ETH' },
              { token: 'Gold', tokenName: 'Gold' },
            ].map(({ token, tokenName }, i) => (
              <li key={i} className={`${styles.currencyListItem}${true ? ' bg-site-dim2' : ''} cursor-pointer`}>
                {tokenName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AmountOut;