import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ConnectWallet from '../pages/ConnectWallet';

const connectWalletMock = vi.fn().mockResolvedValue({ success: true });

vi.mock('../contexts/WalletContext', () => ({
  useWallet: () => ({
    connected: false,
    connecting: false,
    connectWallet: connectWalletMock,
    profile: null,
    needsOnboarding: false,
  }),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
  }),
}));

describe('ConnectWallet integration', () => {
  beforeEach(() => {
    connectWalletMock.mockClear();
    Object.defineProperty(window, 'ethereum', {
      value: { isMetaMask: true },
      writable: true,
      configurable: true,
    });
  });

  it('opens wallet modal and starts wallet connection via MetaMask option', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ConnectWallet />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /connect wallet/i }));

    const metamaskHeading = screen.getByRole('heading', { name: /metaMask/i });
    expect(metamaskHeading).toBeInTheDocument();

    await user.click(metamaskHeading);

    expect(connectWalletMock).toHaveBeenCalledTimes(1);
    expect(connectWalletMock).toHaveBeenCalledWith('metamask');
  });
});
