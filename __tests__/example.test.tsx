import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

// Example component for testing
const ExampleComponent = ({ message }: { message: string }) => {
    return <Text testID="example-text">{message}</Text>;
};

describe('Example Test Suite', () => {
    it('should render component with correct message', () => {
        const { getByTestId } = render(<ExampleComponent message="Hello, World!" />);
        const textElement = getByTestId('example-text');
        expect(textElement).toBeTruthy();
        expect(textElement.props.children).toBe('Hello, World!');
    });

    it('should update when message prop changes', () => {
        const { getByTestId, rerender } = render(<ExampleComponent message="First Message" />);
        expect(getByTestId('example-text').props.children).toBe('First Message');

        rerender(<ExampleComponent message="Second Message" />);
        expect(getByTestId('example-text').props.children).toBe('Second Message');
    });
});

// Example of testing async operations
describe('Async Operations', () => {
    it('should handle async operations', async () => {
        const mockAsyncFunction = jest.fn().mockResolvedValue('Success');
        const result = await mockAsyncFunction();
        expect(result).toBe('Success');
        expect(mockAsyncFunction).toHaveBeenCalledTimes(1);
    });
});
