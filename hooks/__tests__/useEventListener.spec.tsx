import { render, fireEvent, screen } from '@testing-library/react';

import { useEventListener } from '../useEventListener';

const mockHandler = jest.fn();
describe('useEventListener', () => {
  beforeEach(() => {
    mockHandler.mockClear();
  });
  it('should be able to call handler', () => {
    const Component = () => {
      useEventListener('click', mockHandler);

      return <div>test</div>;
    };
    render(<Component />);

    fireEvent.click(screen.getByText('test'));

    expect(mockHandler).toBeCalled();
  });

  it('should not be able to call handler when is disabled', () => {
    const Component = () => {
      useEventListener('click', mockHandler, { disabled: true });

      return <div>test</div>;
    };
    render(<Component />);

    fireEvent.click(screen.getByText('test'));

    expect(mockHandler).not.toBeCalled();
  });

  it('should be able to call handler when click on custom element', () => {
    const Component = () => {
      useEventListener('click', mockHandler, {
        target: document,
      });

      return <div>test</div>;
    };
    render(<Component />);

    fireEvent.click(screen.getByText('test'));

    expect(mockHandler).toBeCalled();
  });
});
