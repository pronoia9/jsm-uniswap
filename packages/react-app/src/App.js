import React from 'react';
import { useEthers } from '@usedapp/core';

import styles from './styles';
import { uniswapLogo } from './assets';
import { Exchange, Loader, WalletButton } from './components';

const App = () => {
  const { account } = useEthers();
  console.log(account);

  // !Temp
  const poolsLoading = false;

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <header className={styles.header}>
          {/* Navbar */}
          <img src={uniswapLogo} alt='uniswap-logo' className='w-16 h-16 object-contain' />
          <WalletButton />
        </header>

        {/* Exchange */}
        <div className={styles.exchangeContainer}>
          <h1 className={styles.headTitle}>Uniswap 2.0</h1>
          <p className={styles.subTitle}>Exchange tokens in seconds.</p>

          <div className={styles.exchangeBoxWrapper}>
            <div className={styles.exchangeBox}>
              <div className='pink_gradient' />
              <div className={styles.exchange}>
                {/* Check if theres a connected metamask account */}
                {account ? poolsLoading ? <Loader /> : <Exchange /> : <Loader />}
              </div>
              <div className='blue_gradient' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;