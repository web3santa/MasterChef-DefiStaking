// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SignedMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract N2DRewards is ERC20, Ownable, AccessControl {
    using Math for uint256;
    using SignedMath for int256;
    using SafeERC20 for ERC20;

    mapping(address => uint256) private _balances;

    uint256 private _totalSupply;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

 constructor() ERC20("N2D Rewards", "N2DR") Ownable(msg.sender) {
    // 생성자 내용 추가 (필요한 경우)
}

function mint(address to, uint256 amount) external onlyOwner() {
    // totalSupply에 대한 오버플로 확인
    (bool successTotal, uint256 newTotalSupply) = _totalSupply.tryAdd(amount);
    require(successTotal, "Total supply overflow");

    // 수신자의 잔액에 대한 오버플로 확인
    (bool successBalance, uint256 newBalance) = _balances[to].tryAdd(amount);
    require(successBalance, "Recipient balance overflow");

    // 토큰을 발행합니다.
    _totalSupply = newTotalSupply;
    _balances[to] = newBalance;
    _mint(to, amount);
}

    function grantRole() external view {
        hasRole(MANAGER_ROLE, msg.sender);
    }
}