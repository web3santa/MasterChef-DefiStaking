const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("N2DRewards", function () {
  let ownerAddress;
  let n2DRewards;
  let master;
  let n2drPerBlock;
  let startBlock;
  let multiplier;
  let n2DRewardsAddress
  let otherAccountAddress;

  this.beforeEach(async () => {
    const [owner, otherAccount] = await ethers.getSigners();
    otherAccountAddress = otherAccount.address
    n2DRewards = await ethers.deployContract("N2DRewards");
    await n2DRewards.waitForDeployment();
    ownerAddress = owner.address;
    n2DRewardsAddress = await n2DRewards.getAddress()
    dev = ethers.ZeroAddress;
    n2drPerBlock = 1; // Adjust as needed
    startBlock = 1; // Adjust as needed
    multiplier = 2; // Adjust as needed

    master = await ethers.deployContract("N2DMasterChefV1", [
      n2DRewardsAddress,
      ownerAddress,
      n2drPerBlock,
      startBlock,
      multiplier,
    ]);
  });

  it("mint Token", async () => {
    const mintAmount = ethers.parseEther("77777");
    await n2DRewards.mint(ownerAddress, mintAmount);

    const ownerBalance = await n2DRewards.balanceOf(ownerAddress);

    expect(ownerBalance).to.be.equal(ethers.parseEther("77777"));
  });

  it("check GrantRol", async () => {
    const result = await n2DRewards.grantRole();
  });

  it("check ContractAssress", async () => {
    const masterAddress = await master.address;
    expect(masterAddress).to.be.equal( await master.address)
  });

  it("check poolInfo", async () => {
    
    const totalAllocation = await master.totalAllocation();
    expect(totalAllocation).to.be.equal('10000')
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
