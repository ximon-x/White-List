// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Whitelist {
    uint8 public maxWhitelistedAddresses;

    mapping(address => bool) public whitelistAddresses;

    uint8 public numAddressesWhitelisted;

    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses = _maxWhitelistedAddresses;
    }

    function addAddressToWhitelist() public {
        require(!whitelistAddresses[msg.sender], "Sender already whitelisted!");
        require(
            numAddressesWhitelisted < maxWhitelistedAddresses,
            "Cannot add user, max limit reached"
        );
        whitelistAddresses[msg.sender] = true;

        numAddressesWhitelisted += 1;
    }
}
