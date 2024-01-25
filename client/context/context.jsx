"use client";
import { createContext, useEffect, useState } from "react";
import Web3 from "web3";
import { contractAddress, contractABI } from "@utils/constants";

const Context = createContext();

const Provider = ({ children }) => {
  const [contract, setContract] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [account, setAccount] = useState();

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        if (window.ethereum) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const web3 = new Web3(window.ethereum);
          const contract = new web3.eth.Contract(contractABI, contractAddress);
          setContract(contract);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        } else {
          throw new Error("no ethereum object found.");
        }
      } catch (err) {
        console.error("error init web3:", err);
      }
    };
    initWeb3();
  }, []);

  const makeReservation = async (amount, ownerAddress) => {
    return new Promise((resolve, reject) => {
      try {
        contract.methods
          .makeReservation(amount, ownerAddress)
          .send({ from: account, value: amount })
          .on("transactionHash", (txhash) => {
            console.log("txhash:", txhash);
            resolve(txhash);
          })
          .on("confirmation", (receipt) => {
            console.log("receipt:", receipt);
          });
      } catch (error) {
        console.error("Failed transaction:", error);
        reject(error);
      }
    });
  };

  const Value = {
    contract,
    account,
    reservations,
    makeReservation,
  };

  return <Context.Provider value={Value}>{children}</Context.Provider>;
};

export { Context, Provider };
