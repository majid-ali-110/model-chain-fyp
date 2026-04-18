const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('UserRegistry', function () {
  async function deployFixture() {
    const [owner, user, validator] = await ethers.getSigners();
    const UserRegistry = await ethers.getContractFactory('UserRegistry');
    const userRegistry = await UserRegistry.connect(owner).deploy();
    await userRegistry.waitForDeployment();

    return { userRegistry, owner, user, validator };
  }

  it('registers and updates a developer profile', async function () {
    const { userRegistry, user } = await deployFixture();

    await expect(userRegistry.connect(user).registerUser('QmInitialProfileHash', 1))
      .to.emit(userRegistry, 'UserRegistered');

    expect(await userRegistry.isUserRegistered(user.address)).to.equal(true);

    await expect(userRegistry.connect(user).updateProfile('QmUpdatedProfileHash'))
      .to.emit(userRegistry, 'ProfileUpdated');

    const profile = await userRegistry.getUserProfile(user.address);
    expect(profile.ipfsHash).to.equal('QmUpdatedProfileHash');
    expect(profile.isDeveloper).to.equal(true);
  });

  it('stakes validator and supports owner approval', async function () {
    const { userRegistry, owner, validator } = await deployFixture();

    await userRegistry.connect(validator).registerUser('QmValidatorProfileHash', 2);
    await userRegistry.connect(validator).stakeAsValidator({ value: ethers.parseEther('0.1') });

    await expect(userRegistry.connect(owner).approveValidator(validator.address))
      .to.emit(userRegistry, 'ValidatorApproved');

    const info = await userRegistry.getValidatorInfo(validator.address);
    expect(info.isApproved).to.equal(true);
  });
});
