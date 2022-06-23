const StorageContract = artifacts.require("Storage");

module.exports = async function (dep) {
    await dep.deploy(StorageContract, [0,0], [0,0]);
}