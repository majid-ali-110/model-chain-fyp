const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Governance', function () {
  async function deployFixture() {
    const [owner, proposer, voter] = await ethers.getSigners();
    const Governance = await ethers.getContractFactory('Governance');
    const governance = await Governance.connect(owner).deploy();
    await governance.waitForDeployment();

    return { governance, proposer, voter };
  }

  it('supports stake -> proposal -> vote lifecycle', async function () {
    const { governance, proposer, voter } = await deployFixture();

    await governance.connect(proposer).stake(7 * 24 * 60 * 60, { value: ethers.parseEther('120') });
    await governance.connect(voter).stake(7 * 24 * 60 * 60, { value: ethers.parseEther('10') });

    const createTx = await governance.connect(proposer).createProposal(
      'Demo Proposal',
      'Proposal for deterministic test flow',
      'QmGovernanceProposalHash',
      1,
      [],
      []
    );

    await expect(createTx).to.emit(governance, 'ProposalCreated');

    await ethers.provider.send('evm_increaseTime', [24 * 60 * 60 + 1]);
    await ethers.provider.send('evm_mine');

    await expect(governance.connect(voter).castVote(1, 1))
      .to.emit(governance, 'VoteCast')
      .withArgs(1, voter.address, 1, await governance.getVotingPower(voter.address));

    await ethers.provider.send('evm_increaseTime', [7 * 24 * 60 * 60 + 1]);
    await ethers.provider.send('evm_mine');

    const state = await governance.getProposalState(1);
    expect([3, 4]).to.include(Number(state));
  });
});
