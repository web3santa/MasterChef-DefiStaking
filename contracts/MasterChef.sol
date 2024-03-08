// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./N2DRewards.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SignedMath.sol";



contract N2DMasterChefV1 is Ownable, N2DRewards {
        using Math for uint256;
    using SignedMath for int256;
        using SafeERC20 for IERC20;

        struct UserInfo {
            uint256 amount;
            uint256 pendingReward;
        }

        struct PoolInfo {
            IERC20 lpToken;
            uint256 allocPoint;
            uint256 lastRewardBlock;
            uint256 rewardTokenPerShare;
        }

        N2DRewards public n2dr;
        address public dev;
        uint256 public n2drPerBlock;

        mapping(uint256 => mapping(address => UserInfo)) public userInfo;

        PoolInfo[] public poolInfo;
        uint256 public totalAllocation = 0;
        uint256 public startBlock;
        uint256 public BONUS_MULTIPLIER;

        constructor (
            N2DRewards _n2dr,
            address _dev,
            uint256 _n2drPerBlock,
            uint256 _startBlock,
            uint256 _multiplier
        ) {
            n2dr = _n2dr;
            dev = _dev;
            n2drPerBlock = _n2drPerBlock;
            startBlock = _startBlock;
            BONUS_MULTIPLIER = _multiplier;

            poolInfo.push(PoolInfo({
                lpToken: _n2dr,
                allocPoint: 10000,
                lastRewardBlock: _startBlock,
                rewardTokenPerShare: 0
            }));
            totalAllocation = 10000;

        }
        
}