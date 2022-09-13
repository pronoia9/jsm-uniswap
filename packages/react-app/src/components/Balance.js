import React from 'react';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import styles from '../styles';

const Balance = () => {
  // !temp
  const tokenBalance = parseUnits('0.00251');

  return (
    <div className={styles.balance}>
      <p className={styles.balanceText}>
        {tokenBalance && (
          <span className={styles.balanceBold}>Balance: {formatUnits(tokenBalance || parseUnits('0'))}</span>
        )}
      </p>
    </div>
  );
};

export default Balance;