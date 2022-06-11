import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";
/**
 * translate account to lowercase
 * @method useAccountTolowercase
 * @returns {string} account to lowercase
 */
export const useAccountTolowercase = (accountRaw) => {
  const [lowerCaseAccount, setLowerCaseAccount] = useState<string | undefined>(
    undefined
  );
  const { account } = useEthers();
  useEffect(() => {
    if (account) {
      setLowerCaseAccount(account.toLowerCase());
    } else {
      setLowerCaseAccount(undefined);
    }
  }, [account]);
  return lowerCaseAccount;
};
