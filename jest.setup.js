// Add any global test setup here
import '@testing-library/jest-native/extend-expect';

// Mock expo-constants
jest.mock('expo-constants', () => ({
    default: {
        expoConfig: {
            extra: {
                supabaseUrl: 'https://test.supabase.co',
                supabaseAnonKey: 'test-key',
            },
        },
    },
}));

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

// Mock react-native AppState
jest.mock('react-native/Libraries/AppState/AppState', () => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
}));
