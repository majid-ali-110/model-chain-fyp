const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('ModelRegistry + Marketplace', function () {
  async function deployFixture() {
    const [deployer, seller, buyer] = await ethers.getSigners();

    const ModelRegistry = await ethers.getContractFactory('ModelRegistry');
    const modelRegistry = await ModelRegistry.connect(seller).deploy();
    await modelRegistry.waitForDeployment();

    const Marketplace = await ethers.getContractFactory('Marketplace');
    const marketplace = await Marketplace.connect(deployer).deploy(await modelRegistry.getAddress());
    await marketplace.waitForDeployment();

    return { modelRegistry, marketplace, seller, buyer };
  }

  it('registers, lists, and purchases a model with expected accounting', async function () {
    const { modelRegistry, marketplace, seller, buyer } = await deployFixture();

    const registerTx = await modelRegistry.connect(seller).registerModel(
      'Demo Model',
      'QmModelFileHash',
      'QmMetadataHash',
      0,
      ethers.parseEther('0.01')
    );
    await registerTx.wait();

    await expect(
      marketplace.connect(seller).listModel(0, ethers.parseEther('0.01'), 300, 1000)
    )
      .to.emit(marketplace, 'ModelListed')
      .withArgs(0, seller.address, ethers.parseEther('0.01'));

    const personalPrice = await marketplace.calculatePrice(0, 0);
    expect(personalPrice).to.equal(ethers.parseEther('0.01'));

    await expect(
      marketplace.connect(buyer).purchaseModel(0, 0, { value: personalPrice })
    )
      .to.emit(marketplace, 'ModelPurchased')
      .withArgs(0, buyer.address, personalPrice, 0);

    expect(await marketplace.checkAccess(0, buyer.address)).to.equal(true);
    expect(await marketplace.pendingWithdrawals(seller.address)).to.equal(ethers.parseEther('0.00975'));

    const model = await modelRegistry.getModel(0);
    expect(model.totalDownloads).to.equal(1);
  });

  it('applies commercial multiplier pricing and blocks duplicate purchase', async function () {
    const { modelRegistry, marketplace, seller, buyer } = await deployFixture();

    await modelRegistry.connect(seller).registerModel(
      'Commercial Model',
      'QmCommercialModelFileHash',
      'QmCommercialMetadataHash',
      0,
      ethers.parseEther('0.02')
    );

    await marketplace.connect(seller).listModel(0, ethers.parseEther('0.02'), 300, 1000);

    const commercialPrice = await marketplace.calculatePrice(0, 1);
    expect(commercialPrice).to.equal(ethers.parseEther('0.06'));

    await marketplace.connect(buyer).purchaseModel(0, 1, { value: commercialPrice });

    await expect(
      marketplace.connect(buyer).purchaseModel(0, 1, { value: commercialPrice })
    ).to.be.revertedWith('Already purchased');
  });
});
