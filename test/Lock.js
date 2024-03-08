const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("N2DRewards", function () {
  let ownerAddress;
  let godRewards;
  let master;
  let godsPerBlock;
  let startBlock;
  let multiplier;
  let godsRewardsAddress;
  let otherAccountAddress;

  this.beforeEach(async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    otherAccountAddress = otherAccount.address;
    godRewards = await ethers.deployContract("GodRewards");
    await godRewards.waitForDeployment();
    ownerAddress = owner.address;
    godsRewardsAddress = await godRewards.getAddress();
    dev = ethers.ZeroAddress;
    godsPerBlock = 1; // Adjust as needed
    startBlock = 1; // Adjust as needed
    multiplier = 2; // Adjust as needed

    master = await ethers.deployContract("N2DMasterChefV1", [
      godsRewardsAddress,
      ownerAddress,
      godsPerBlock,
      startBlock,
      multiplier,
    ]);

    await master.waitForDeployment();

    const mintAmount = ethers.parseEther("77777");
    const transferValue = ethers.parseEther("200");
    await godRewards.mint(ownerAddress, mintAmount);

    const ownerBalance = await godRewards.balanceOf(ownerAddress);

    expect(ownerBalance).to.be.equal(ethers.parseEther("77777"));

    const approval = await godRewards.approve(ownerAddress, ethers.MaxUint256)
    await approval.wait()

    const transaction = await godRewards.transferFrom(ownerAddress, otherAccount, transferValue)
    await transaction.wait()
  });
 

  it("check GrantRol", async () => {
    const result = await godRewards.grantRole();
  });

  it("check ContractAssress", async () => {
    const masterAddress = await master.address;
    expect(masterAddress).to.be.equal(await master.address);
  });

  it("check poolInfo", async () => {
    const totalAllocation = await master.totalAllocation();
    expect(totalAllocation).to.be.equal("10000");
  });

  it("Gods Rewards Name", async () => {
    const Name = "Gods Rewards";
    const n2dName = await godRewards.name();
    expect(n2dName).to.be.equal(Name);
  });

  it("GOD Symbol", async () => {
    const Symbol = "GOD";
    const symbol = await godRewards.symbol();
    expect(symbol).to.be.equal(Symbol);
  });


  it("check other balance", async () => {
    const transferValue = ethers.parseEther("200");
    // await n2DRewards.connect(owner).mint(otherAccountAddress, mintAmount);
    const otherBalance = await godRewards.balanceOf(otherAccountAddress);
    expect(transferValue).to.be.equal(otherBalance);
    // expect(ownerBalance).to.be.equal(mintAmount);
  });
});

// describe("Deployment", function () {
//   it("Should set the right unlockTime", async function () {
//     const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);

//     expect(await lock.unlockTime()).to.equal(unlockTime);
//   });

//   it("Should set the right owner", async function () {
//     const { lock, owner } = await loadFixture(deployOneYearLockFixture);

//     expect(await lock.owner()).to.equal(owner.address);
//   });

//   it("Should receive and store the funds to lock", async function () {
//     const { lock, lockedAmount } = await loadFixture(
//       deployOneYearLockFixture
//     );

//     expect(await ethers.provider.getBalance(lock.target)).to.equal(
//       lockedAmount
//     );
//   });

//   it("Should fail if the unlockTime is not in the future", async function () {
//     // We don't use the fixture here because we want a different deployment
//     const latestTime = await time.latest();
//     const Lock = await ethers.getContractFactory("Lock");
//     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
//       "Unlock time should be in the future"
//     );
//   });
// });

// describe("Withdrawals", function () {
//   describe("Validations", function () {
//     it("Should revert with the right error if called too soon", async function () {
//       const { lock } = await loadFixture(deployOneYearLockFixture);

//       await expect(lock.withdraw()).to.be.revertedWith(
//         "You can't withdraw yet"
//       );
//     });

//     it("Should revert with the right error if called from another account", async function () {
//       const { lock, unlockTime, otherAccount } = await loadFixture(
//         deployOneYearLockFixture
//       );

//       // We can increase the time in Hardhat Network
//       await time.increaseTo(unlockTime);

//       // We use lock.connect() to send a transaction from another account
//       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
//         "You aren't the owner"
//       );
//     });

//     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
//       const { lock, unlockTime } = await loadFixture(
//         deployOneYearLockFixture
//       );

//       // Transactions are sent using the first signer by default
//       await time.increaseTo(unlockTime);

//       await expect(lock.withdraw()).not.to.be.reverted;
//     });
//   });

//   describe("Events", function () {
//     it("Should emit an event on withdrawals", async function () {
//       const { lock, unlockTime, lockedAmount } = await loadFixture(
//         deployOneYearLockFixture
//       );

//       await time.increaseTo(unlockTime);

//       await expect(lock.withdraw())
//         .to.emit(lock, "Withdrawal")
//         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
//     });
//   });

//   describe("Transfers", function () {
//     it("Should transfer the funds to the owner", async function () {
//       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
//         deployOneYearLockFixture
//       );

//       await time.increaseTo(unlockTime);

//       await expect(lock.withdraw()).to.changeEtherBalances(
//         [owner, lock],
//         [lockedAmount, -lockedAmount]
//       );
//     });
//   });
// });
