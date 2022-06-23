const Web3 = require("Web3")
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const RLP  = require('rlp');

let storage = [];

const getStorageSlots = async ({address, from, to}) => {
    if(!address) address = await findLatestDeployment();

    for(let index = from; index < to; index++) {
        const value = await web3.eth.getStorageAt(address, index);
        storage.push({index, value})
    }
    console.log(storage);
}

const getAccountAndNonce = async () => {
    const accArray = await web3.eth.getAccounts();
    const nonce = await web3.eth.getTransactionCount(accArray[0]);
    console.log("operating Account: ", accArray[0], "\nnonce: ", nonce);
    return [accArray[0], nonce];
}

const findLatestDeployment = async () => {
    let [ account, nonce ] = await getAccountAndNonce();
    // decrement to get the latest used nonce
    --nonce;
    while(nonce > 0) {
        // get the address where the contract WOULD have been deployed given account and nonce
        const potentialContractAddress = calculateDeploymentAddress(account, nonce);
        // get the code to see if there is a contract
        const isContract = await web3.eth.getCode(potentialContractAddress) != "0x";
        console.log({ potentialContractAddress, isContract })
        if(isContract) return potentialContractAddress;

        nonce--;
    }
    throw "no deployment found";
}

const calculateDeploymentAddress = (account, nonce) => {
    const hash = web3.utils.sha3(
        RLP.encode(
            [
                account,
                nonce
            ],
        ),
    );
    return '0x' + hash.slice(26);
};

getStorageSlots({address: "", from: 0, to: 10})