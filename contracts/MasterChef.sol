// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./GodRewards.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SignedMath.sol";

contract N2DMasterChefV1 is Ownable, GodRewards {
    using Math for uint256;
    using SignedMath for int256;
    using SafeERC20 for IERC20;

    struct UserInfo {
        uint256 amount;
        uint256 pendingReward;
    }

    // lastRewardBlock = block.number >= startBlock ? block.number : startBlock
    struct PoolInfo {
        IERC20 lpToken;
        uint256 allocPoint;
        uint256 lastRewardBlock;
        uint256 rewardTokenPerShare;
    }

    GodRewards public gods;
    address public dev;
    uint256 public godPerBlock;

    mapping(uint256 => mapping(address => UserInfo)) public userInfo;

    PoolInfo[] public poolInfo;
    uint256 public totalAllocation = 0;
    uint256 public startBlock;
    uint256 public BONUS_MULTIPLIER;

    constructor(
        GodRewards _gods,
        address _dev,
        uint256 _godsPerBlock,
        uint256 _startBlock,
        uint256 _multiplier
    ) {
        gods = _gods;
        dev = _dev;
        godPerBlock = _godsPerBlock;
        startBlock = _startBlock;
        BONUS_MULTIPLIER = _multiplier;

        poolInfo.push(
            PoolInfo({
                lpToken: _gods,
                allocPoint: 1000,
                lastRewardBlock: _startBlock,
                rewardTokenPerShare: 0
            })
        );
        totalAllocation = 10000;
    }

    function stake(uint256 pid, uint256 amount, address _user) external {
        UserInfo storage user = userInfo[pid][_user];
        user.amount += amount;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    function getPoolInfo(
        uint256 pid
    )
        public
        view
        returns (
            address lpToken,
            uint256 allocPoint,
            uint256 lastRewardBlock,
            uint256 rewardTokenPerShare
        )
    {
        return (
            (address(poolInfo[pid].lpToken)),
            poolInfo[pid].allocPoint,
            poolInfo[pid].lastRewardBlock,
            poolInfo[pid].rewardTokenPerShare
        );
    }

    function getMultiplier(
        uint256 _from,
        uint256 _to
    ) public view returns (uint256) {
        uint256 amount;
        (bool successSub, uint256 newSub) = _to.trySub(_from);
        require(successSub, "Total supply overflow");

        amount = newSub;
        (bool successMul, uint256 newMul) = amount.tryMul(BONUS_MULTIPLIER);
        require(successMul, "Total supply overflow");

        amount = newMul;
        return amount;
    }

    function updateMultiplier(uint256 multiplierNumber) public onlyOwner {
        BONUS_MULTIPLIER = multiplierNumber;
    }

    function checkPoolDuplicate(IERC20 token) public view returns (bool) {
        uint256 length = poolInfo.length;
        for (uint256 _pid = 0; _pid < length; _pid++) {
            require(poolInfo[_pid].lpToken != token, "Pool Already Exists");
        }

        return false;
    }

    function updateStakingPool() internal {
        uint256 length = poolInfo.length;
        uint256 points = 0;
        for (uint256 pid = 0; pid < length; pid++) {
            (bool pointAdd, uint256 tempResult) = points.tryAdd(
                poolInfo[pid].allocPoint
            );
            require(pointAdd, "Point addition overflow");
            points = tempResult;
        }

        if (points != 0) {
            (bool dividebool, uint256 dividedPoints) = points.tryDiv(3);
            require(dividebool, "Point division overflow");

            (bool subbool, uint256 remainingPoints) = totalAllocation.trySub(
                poolInfo[0].allocPoint
            );
            require(subbool, "Point subtraction overflow");

            (bool addbool, uint256 addPoints) = remainingPoints.tryAdd(
                dividedPoints
            );
            require(addbool, "Point add overflow");

            poolInfo[0].allocPoint = addPoints;
        }
    }

    function add(uint256 _allocPoint, IERC20 _lpToken) public onlyOwner {
        checkPoolDuplicate(_lpToken);
        uint256 lastRewardBlock = block.number > startBlock
            ? block.number
            : startBlock;
        (bool totalAlloc, uint256 addTotal) = totalAllocation.tryAdd(
            _allocPoint
        );
        require(totalAlloc, "totalAllocation addition overflow");
        totalAllocation = addTotal;

        poolInfo.push(
            PoolInfo({
                lpToken: _lpToken,
                allocPoint: _allocPoint,
                lastRewardBlock: lastRewardBlock,
                rewardTokenPerShare: 0
            })
        );

        updateStakingPool();
    }
    // PoolInfo storage pool = poolInfo[pid]
    // pool.allocPoint = 4000
    // pool.lpToken = USDT Contract address
    // pool.lastRewardBlock = lastRewardBlock
    // pool.rewardTokenPerShare = 0;
}
