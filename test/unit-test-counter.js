const StorageContract = artifacts.require("Storage");

contract("Storage gas test", () => {

    beforeEach(async () => {
        this.STR = await StorageContract.new([0, 0], [0, 0]);
    })

    describe("write", async () => {
        it("setStruct256Both", async () => {
            await this.STR.setStruct256Both(1, 1);
        })
        it("setStruct128Both", async () => {
            await this.STR.setStruct128Both(1, 1);
        })
        it("setStruct256Single", async () => {
            await this.STR.setStruct256Single(1);
        })
        it("setStruct128Single", async () => {
            await this.STR.setStruct128Single(1);
        })
    })

    describe("read", async () => {
        const forceSend = async (readFunction) => {
            await readFunction.sendTransaction();
        }
        it("", async () => {
            await forceSend(this.STR.readBigStorageStructBoth);
            await forceSend(this.STR.readBigStorageStructSingle);
            await forceSend(this.STR.readSmallStorageStructBoth);
            await forceSend(this.STR.readSmallStorageStructSingle);
        })
    })
})