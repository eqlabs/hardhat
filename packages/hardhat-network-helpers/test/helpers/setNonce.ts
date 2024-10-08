import { assert } from "chai";
import { BN } from "ethereumjs-util";
import { ethers } from "ethers-v5";

import * as hh from "../../src";
import { NumberLike } from "../../src/types";
import { useEnvironment, rpcQuantityToNumber } from "../test-utils";

describe("setNonce", function () {
  useEnvironment("simple");
  const account = "0x000000000000000000000000000000000000bEEF";

  const getNonce = async (address: string) => {
    const nonce = await this.ctx.hre.network.provider.send(
      "eth_getTransactionCount",
      [address]
    );

    return rpcQuantityToNumber(nonce);
  };

  it("should allow setting the nonce of an unused address", async function () {
    await hh.setNonce(account, 5);

    assert.equal(await getNonce(account), 5);
  });

  it("should allow setting the nonce of a used address", async function () {
    const account = "0xDE0792B9517DD79201f7a85e0D0ee6F879dFdd63";
    await hh.setBalance(account, "0xaaaaaaaaaaaaaaaaaaaaaa");
    await this.hre.network.provider.send("hardhat_impersonateAccount", [
      account,
    ]);
    await this.hre.network.provider.send("eth_sendTransaction", [
      {
        from: account,
        to: "0x98e6C752aC631eEAb04b3Cf3Eb844361FE895DF4",
        value: "0x1",
      },
    ]);
    await hh.mine();

    assert.equal(await getNonce(account), 0);
    await hh.setNonce(account, 5);

    assert.equal(await getNonce(account), 5);
  });

  it("should not allow setting a nonce smaller than the current nonce", async function () {
    const account = "0x8B32fE2b84F504E55B2775a8DA1c796d8F502924";
    await hh.setNonce(account, 5);

    assert.equal(await getNonce(account), 5);
    await assert.isRejected(hh.setNonce(account, 1));
  });

  describe("accepted parameter types for nonce", function () {
    const nonceExamples: Array<[string, NumberLike, number]> = [
      ["hex encoded with leading zeros", "0x01e240", 123456],
      ["number", 2000001, 2000001],
      ["bigint", BigInt(2000002), 2000002],
      ["hex encoded", "0x1e8483", 2000003],
      ["ethers's bignumber instances", ethers.BigNumber.from(2000004), 2000004],
      ["bn.js instances", new BN(2000005), 2000005],
    ];

    for (const [type, value, expectedNonce] of nonceExamples) {
      it(`should accept balance of type ${type}`, async function () {
        await hh.setNonce(account, value);

        assert.equal(await getNonce(account), expectedNonce);
      });
    }
  });
});
