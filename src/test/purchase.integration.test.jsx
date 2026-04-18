import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ModelDetail from '../pages/marketplace/ModelDetail';

const loadModelsMock = vi.fn().mockResolvedValue(undefined);
const purchaseModelMock = vi.fn();
const rateModelMock = vi.fn();

const modelFixture = {
  id: '1',
  name: 'ModelChain Demo Model',
  description: 'Purchase integration flow test',
  owner: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  category: 'text',
  verified: true,
  rating: 4.9,
  totalRatings: 10,
  downloads: 20,
  tags: ['demo'],
  price: '0.01',
  isListed: true,
};

vi.mock('../contexts/ModelContext', () => ({
  useModel: () => ({
    models: [modelFixture],
    getModelById: (id) => (id === '1' ? modelFixture : null),
    loadModels: loadModelsMock,
    purchaseModel: purchaseModelMock,
    rateModel: rateModelMock,
  }),
}));

vi.mock('../contexts/WalletContext', () => ({
  useWallet: () => ({
    connected: true,
    address: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  }),
}));

describe('Purchase integration', () => {
  beforeEach(() => {
    purchaseModelMock.mockReset();
    rateModelMock.mockReset();
    loadModelsMock.mockClear();
  });

  it('purchases a listed model and shows success feedback', async () => {
    purchaseModelMock.mockResolvedValue({ success: true });

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/marketplace/models/1']}>
        <Routes>
          <Route path="/marketplace/models/:id" element={<ModelDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /purchase access/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /purchase access/i }));

    await waitFor(() => {
      expect(purchaseModelMock).toHaveBeenCalledWith('1', 0);
    });

    expect(screen.getByText(/purchase completed successfully/i)).toBeInTheDocument();
  });
});
