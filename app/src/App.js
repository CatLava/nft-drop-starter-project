import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import CandyMachine from './CandyMachine';

// Constants
const TWITTER_HANDLE = 'YoSnickerdoodle';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // setting state for render wallet connect
  const [walletAddress, setWalletAddress] = useState(null);

  const checkIfWalletIsConnected = async() => {
    try {
      const { solana } = window;

      if (solana && solana.isPhantom) {
        console.log('Dope! Phantom wallet is found!');
        // allow connection to the wallet
        const response = await solana.connect({ onlyIfTrusted: true});
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );

        // set publickey in state to be used in render
        setWalletAddress(response.publicKey.toString());
      } else {
        alert('solana object not found! Need a Phantom wallet');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Pub Key: ', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  // render UI when wallet is not connected
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect Phantom Wallet
    </button>
  );

  // when JS component loads, check if phantom is connected
  // if wallet is connect, proceed 
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);


  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Doodle Dog Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {/* Render connect wallet button here */}
          {!walletAddress && renderNotConnectedContainer()}
        </div>
        {/* Check for wallet address then pass in walletAddress */}
        {walletAddress && <CandyMachine walletAddress={window.solana} />}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
