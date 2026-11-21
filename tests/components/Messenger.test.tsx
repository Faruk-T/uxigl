// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Messenger } from '../../src/components/composites/Messenger';

describe('Messenger Composite (WhatsApp-like)', () => {
  it('renders conversations with stock avatars and initials fallback', () => {
    const { container } = render(<Messenger locale="tr" enableAutoReply={false} />);

    expect(screen.getAllByText('Selin Kaya').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Emre Demir').length).toBeGreaterThanOrEqual(1);
    // Stock portrait image for Selin Kaya + initials fallback 'ED' for Emre Demir
    expect(container.querySelectorAll('img').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('ED')).toBeTruthy();
  });

  it('filters conversations via search and switches active chat', () => {
    render(<Messenger locale="tr" enableAutoReply={false} />);

    const searchInput = screen.getByLabelText('Sohbet ara');
    fireEvent.change(searchInput, { target: { value: 'Zeynep' } });

    expect(screen.getByText('Zeynep Aksoy')).toBeTruthy();
    expect(screen.queryByText('Can Yılmaz')).toBeNull();

    fireEvent.click(screen.getByText('Zeynep Aksoy'));
    expect(screen.getByRole('region', { name: 'Zeynep Aksoy' })).toBeTruthy();
  });

  it('sends a new message and invokes onSendMessage callback', () => {
    const onSendMessage = vi.fn();
    render(<Messenger locale="tr" enableAutoReply={false} onSendMessage={onSendMessage} />);

    const input = screen.getByLabelText('Mesaj yazın');
    fireEvent.change(input, { target: { value: 'Merhaba ekip!' } });
    fireEvent.submit(input.closest('form')!);

    expect(screen.getAllByText('Merhaba ekip!').length).toBeGreaterThanOrEqual(1);
    expect(onSendMessage).toHaveBeenCalledTimes(1);
    expect(onSendMessage.mock.calls[0][1].text).toBe('Merhaba ekip!');
  });
});
