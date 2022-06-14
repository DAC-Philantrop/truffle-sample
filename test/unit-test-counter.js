// import all the contracts needed in the test file
const CounterContract = artifacts.require("Counter");

// import some utilities
const { time, expectRevert, expectEvent, BN } = require("@openzeppelin/test-helpers")

// enables assert.isTrue, assert.isAbove and many more !
const { assert } = require('chai');

// define some constants or test parameters we will use
const CounterStart = 2**40;

// test starts with contract(), the array of available accounts is passed in automatically
// to test the owner <> not-owner differences, we will use 2 accounts:
//  - owner (is the owner of the contract)
//  - alice (is a random wallet without special access)
contract("CounterContract", ([alice, owner]) => {
    
    // before is executed ONCE before all the tests run. 
    // beforeEach is executed ONCE before EVERY single test (it("test") ... )
    before(async () => {

        // we want to deploy the contract from the owner wallet, so that owner is actually the owner
        this.COUNTER = await CounterContract.new(CounterStart, { from: owner });
    })
    // test cases start here

    // first validate the state of the contract is as expected:
    it("validate setup", async () => {
        assert.equal(await this.COUNTER.owner(), owner);
        assert.equal(await this.COUNTER.get(), CounterStart);
    })

    // check different scenarios:
    it("anyone can increment", async () => {
        // check counter value before:
        let counterBefore = await this.COUNTER.get();

        await this.COUNTER.inc( { from: alice } );
        
        // here we have to first case counter before from the BN object to a number
        assert.equal(+await this.COUNTER.get(), +counterBefore + 1);

        // alternatively we can use BN.add()
        assert.equal(+await this.COUNTER.get(), +counterBefore.add(new BN("1")));
    })
    it("anyone can decrement", async () => {
        // check counter value before:
        let counterBefore = await this.COUNTER.get();

        await this.COUNTER.dec( { from: alice } );

        // here we have to first case counter before from the BN object to a number
        assert.equal(+await this.COUNTER.get(), +counterBefore - 1);

        // alternatively we can use BN.sub()
        assert.equal(+await this.COUNTER.get(), +counterBefore.sub(new BN("1")));
    })
    it("only the owner can setCount" , async () => {
        // we use expectRevert to validate that a tx fails for a specific reason:
        await expectRevert(
            this.COUNTER.setCount(100, { from: alice }), // tx without await
            "Ownable: caller is not the owner"           // expected error string (see Ownable.sol)
        );
        
        // we can save the receipt to check different things on it, for example the emitted events
        let setCountTx = await this.COUNTER.setCount(100, { from: owner });

        // check that the correct event was emitted: 
        // params: tx-receipt, event-name, event-args (object)
        await expectEvent(setCountTx, "OwnerSetValue", {
            owner: owner,
            value: "100"
        })

        assert.equal(await this.COUNTER.get(), 100);
    })
})