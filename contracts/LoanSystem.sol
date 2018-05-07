pragma solidity ^0.4.2;

contract LoanSystem {
    enum LoanStatus {
        PROPOSAL,
        ACTIVE,
        COMPLETE,
        FAILED
    }

    struct Proposal {
        address by;
        uint amount;
        uint interest;
            
    }

    struct Loan {
        uint startDate;
        uint amount;
        LoanStatus status;
        Proposal[] proposals;
        address takenFrom;
        string desc;
    }

    struct User {
        address user;
        Loan loanTaken;

    }
}