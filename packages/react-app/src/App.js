import React from 'react';
import { useEthers } from '@usedapp/core';

import styles from './styles';
import { uniswapLogo } from './assets';

const App = () => {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <header className={styles.header}>
          {/* Navbar */}
          <img src={uniswapLogo} alt='uniswap-logo' className='w-16 h-16 object-contain' />
        </header>
      </div>
    </div>
  );
};

export default App;