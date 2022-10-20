/* eslint-disable react/no-unescaped-entities */
import type { NextPage } from "next";
import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import {
  WHITELIST_CONTRACT_ADDRESS,
  WHITELIST_CONTRACT_ABI,
} from "../../Constants";
import { Contract, providers } from "ethers";
import Image from "next/image";

const Home: NextPage = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const web3ModalRef = useRef<Web3Modal>();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current!.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };

  const addAddressToWhitelist = async () => {
    try {
      const signer = (await getProviderOrSigner(
        true
      )) as providers.JsonRpcSigner;

      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        WHITELIST_CONTRACT_ABI,
        signer
      );

      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = (await getProviderOrSigner()) as providers.Web3Provider;
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        WHITELIST_CONTRACT_ABI,
        provider
      );

      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.log(err);
    }
  };

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = (await getProviderOrSigner(
        true
      )) as providers.JsonRpcSigner;
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        WHITELIST_CONTRACT_ABI,
        signer
      );

      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistAddresses(
        address
      );

      setJoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to my the Greatest Dapp ever!
          </h1>
          <div className={styles.description}>
            It's an NFT collection for developers in Web3
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <Image
            src="/queue.gif"
            alt="Should see an image instead"
            height={300}
            width={300}
          />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Simon Samuel
      </footer>
    </div>
  );
};

export default Home;
