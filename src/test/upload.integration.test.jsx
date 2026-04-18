import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Upload from '../pages/developer/Upload';

const uploadModelMock = vi.fn();
const listModelForSaleMock = vi.fn();

vi.mock('../contexts/WalletContext', () => ({
  useWallet: () => ({
    address: '0x1234567890abcdef1234567890abcdef12345678',
    isConnected: true,
  }),
}));

vi.mock('../contexts/ModelContext', () => ({
  useModels: () => ({
    uploadModel: uploadModelMock,
    listModelForSale: listModelForSaleMock,
  }),
}));

vi.mock('../components/ui/Dropdown', () => ({
  default: ({ trigger, items }) => (
    <div>
      {trigger}
      <div>
        {items?.map((item) => (
          <button key={item.label} type="button" onClick={item.onClick}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  ),
}));

describe('Upload integration', () => {
  beforeEach(() => {
    uploadModelMock.mockReset();
    listModelForSaleMock.mockReset();
  });

  it('submits upload flow and creates listing when price is set', async () => {
    uploadModelMock.mockResolvedValue({ success: true, tokenId: '1' });
    listModelForSaleMock.mockResolvedValue({ success: true });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Upload />
      </MemoryRouter>
    );

    const fileInput = document.querySelector('input[type="file"]');
    const modelFile = new File(['dummy-model'], 'model.onnx', { type: 'application/octet-stream' });
    await user.upload(fileInput, modelFile);

    await user.type(screen.getByLabelText(/model name/i), 'Demo Vision Model');
    await user.click(screen.getByRole('button', { name: /language models/i }));
    await user.type(screen.getByLabelText(/price \(eth\)/i), '0.01');
    await user.type(
      screen.getByPlaceholderText(/describe your model's capabilities, use cases, and performance/i),
      'End-to-end upload flow test model'
    );
    await user.click(screen.getByRole('button', { name: /mit license/i }));

    await user.click(screen.getByRole('button', { name: /^upload model$/i }));

    await waitFor(() => {
      expect(uploadModelMock).toHaveBeenCalledTimes(1);
    });

    expect(uploadModelMock).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Demo Vision Model',
      category: 'text',
      price: 0.01,
      file: expect.any(File),
    }));

    await waitFor(() => {
      expect(listModelForSaleMock).toHaveBeenCalledWith('1', 0.01, 300, 1000);
    });
  });
});
