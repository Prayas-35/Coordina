// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Coordina {
    struct Project {
        uint256 id;
        string name;
        address owner;
        uint256 budget;
        uint256 deadline;
        uint256 time;
        uint256 status;
        string department;
        string department_uid;
        uint256 wardNumber;
        uint256 duration;
        string supervision;
        string resources;
    }

    struct Agency {
        
    }
}