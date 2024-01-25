// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Parkade {
    struct Reservation {
        uint256 amount;
        bool paid;
        address ownerAddress;
    }

    mapping(bytes32 => Reservation) public reservations;

    event Rsvn(
        bytes32 indexed reservationId,
        address indexed user,
        uint256 amount,
        bool paid,
        address ownerAddress
    );

    function makeReservation(
        uint256 _amount,
        address payable _ownerAddress
    ) external payable {
        require(_amount > 0, "Amount should be greater than 0");

        bytes32 reservationId = keccak256(
            abi.encodePacked(msg.sender, block.timestamp)
        );
        Reservation memory newReservation = Reservation(
            _amount,
            false,
            _ownerAddress
        );
        reservations[reservationId] = newReservation;

        emit Rsvn(reservationId, msg.sender, _amount, false, _ownerAddress);

        require(msg.value >= _amount, "Insufficient payment amount");

        reservations[reservationId].paid = true;
        _ownerAddress.transfer(_amount);

        emit Rsvn(reservationId, msg.sender, _amount, true, _ownerAddress);
    }

    receive() external payable {}
}
