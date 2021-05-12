pragma solidity >=0.4.25 <0.7.0;
pragma experimental ABIEncoderV2;

contract RoscaFactory {
    Rosca[] public deployedRoscas;

    function createRosca(uint cycleTotal, uint participants, string memory description) public {
        Rosca newRosca = new Rosca(cycleTotal, participants, msg.sender, description);
        deployedRoscas.push(newRosca);
    }

    function getDeployedRoscas() public view returns (Rosca[] memory) {
        return deployedRoscas;
    }
}

contract Rosca {

    struct Participant {
        uint amount;
        bool wonCycle;
        bool set;
        mapping (uint => uint) contributions; //tracks contributions for this participant per cycle
    }

    struct Summary {
      address manager;
      uint cycleContribution;
      uint nrOfParticipants;
      uint activeParticipants;
      uint currentCycle;
      uint timestamp;
      uint funds;
      uint fundsRequiredForCycle;
      address payable [] participants;
      string description;
    }

    struct Cycle {
        uint currentAmount; //currently collected in cycle
        uint cycleAmount; //needed to complete cycle
        bool completed;
        uint started;
        mapping (address => uint) bids;
    }

    uint public cycleContribution; //base amount per participant per cycle
    address payable public manager;
    uint public nrOfParticipants;
    uint public currentCycle;
    uint public timestamp;
    string public description;
    address payable [] public addresses;
    mapping (address => Participant) public participants;
    Cycle[] public cycles;

    modifier stillActive() {
        require(currentCycle < nrOfParticipants);
        _;
    }

    modifier isManager() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint cycleTotal, uint participants, address payable creator, string memory descr) public {
        cycleContribution = cycleTotal / participants;
        manager = creator;
        nrOfParticipants = participants;
        currentCycle = 0;
        timestamp = now;
        description = descr;

        Cycle memory newCycle = Cycle({
            currentAmount: 0,
            cycleAmount: cycleTotal,
            completed: false,
            started: now
        });

        cycles.push(newCycle);
    }

    function getSummary() public view returns (Summary memory) {

      Summary memory cycleSummary = Summary({
        manager: manager,
        cycleContribution: cycleContribution,
        nrOfParticipants: nrOfParticipants,
        currentCycle: currentCycle,
        activeParticipants: addresses.length,
        timestamp: timestamp,
        funds: address(this).balance,
        fundsRequiredForCycle: cycles[currentCycle].cycleAmount,
        participants: addresses,
        description: description
      });

      return cycleSummary;
    }

    function getParticipants() public view returns (address payable [] memory) {
      return addresses;
    }

    function getCycle(uint cycleNr) public view returns (uint, uint, bool, uint) {
      return (
        cycles[cycleNr].currentAmount,
        cycles[cycleNr].cycleAmount,
        cycles[cycleNr].completed,
        cycles[cycleNr].started
      );
    }

    function enter() public payable {
        require(currentCycle == 0);
        require(msg.value >= cycleContribution);
        require(!participants[msg.sender].set);
        require(cycles[currentCycle].currentAmount < cycles[currentCycle].cycleAmount);

        Participant memory newParticipant = Participant({
            amount: cycleContribution,
            wonCycle: false,
            set: true
        });

        addresses.push(msg.sender);

        participants[msg.sender] = newParticipant;
        participants[msg.sender].contributions[currentCycle] = msg.value;

        cycles[currentCycle].currentAmount += msg.value;

    }

    function contribute() public payable stillActive {
        require(msg.value >= participants[msg.sender].amount);
        require(participants[msg.sender].set);
        require(participants[msg.sender].contributions[currentCycle] == 0); //make sure this participant has not yet contributed to this cycle

        addresses.push(msg.sender);

        cycles[currentCycle].currentAmount += msg.value;
    }

    function bid(uint participantBid) public stillActive {
        require(address(this).balance == cycles[currentCycle].cycleAmount);
        require(participants[msg.sender].set);
        require(cycles[currentCycle].bids[msg.sender] == 0);
        require(participantBid > 0);

        cycles[currentCycle].bids[msg.sender] = participantBid;
    }

    function endCycle() public stillActive isManager {
        require(address(this).balance == cycles[currentCycle].cycleAmount);

        //determine winning bid
        uint highestBid = 0;
        address payable winner;

        for(uint i = 0; i < addresses.length; i++) {
            if ( cycles[currentCycle].bids[addresses[i]] > highestBid ) {
                highestBid = cycles[currentCycle].bids[addresses[i]];
                winner = addresses[i];
            }
        }

        if ( highestBid == 0 ) { //we do not have a cycle winner, pick one randomly
            winner = manager;
        }

        participants[winner].amount = cycleContribution + highestBid;
        participants[winner].wonCycle = true;
        winner.transfer(address(this).balance);

        cycles[currentCycle].completed = true;

        // Start new cycle, if contract is still ongoing
        if (currentCycle < nrOfParticipants) {

          Cycle memory newCycle = Cycle({
              currentAmount: 0,
              cycleAmount: cycles[currentCycle].cycleAmount + highestBid,
              completed: false,
              started: now
          });

          cycles.push(newCycle);
          currentCycle += 1;
        }
    }

    function resetCycle() public isManager {

        for(uint i = 0; i < addresses.length; i++) {
            if (participants[addresses[i]].contributions[currentCycle] > 0) {
                addresses[i].transfer(participants[addresses[i]].contributions[currentCycle]);

                //reset this cycle's contribution for this participant
                delete participants[addresses[i]].contributions[currentCycle];
            }

            // if first cycle, remove participant from mapping
            if (currentCycle == 0) {
              delete participants[addresses[i]];
            }
        }

        //if we are in cycle 0, remove participants address from circle contract
        if (currentCycle == 0) {
          //delete participants;
          delete addresses;
        }

        // reset cycle
        cycles[currentCycle].currentAmount = 0;
        cycles[currentCycle].completed = false;

        //reset bids in current cycle

    }

}
