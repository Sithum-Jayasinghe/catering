import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, APP_CONSTANTS } from '../utils/constants';

export async function storeToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(APP_CONSTANTS.TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store token:', error);
    throw error;
  }
}

export async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token:', error);
    return null;
  }
}

export async function removeToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(APP_CONSTANTS.TOKEN_KEY);
  } catch (error) {
    console.error('Failed to remove token:', error);
    throw error;
  }
}

export async function storeUser<T>(user: T): Promise<void> {
  try {
    await AsyncStorage.setItem(APP_CONSTANTS.USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to store user:', error);
    throw error;
  }
}

export async function getUser<T = Record<string, unknown>>(): Promise<T | null> {
  try {
    const userStr = await AsyncStorage.getItem(APP_CONSTANTS.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Failed to get user:', error);
    return null;
  }
}

export async function removeUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(APP_CONSTANTS.USER_KEY);
  } catch (error) {
    console.error('Failed to remove user:', error);
    throw error;
  }
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      APP_CONSTANTS.TOKEN_KEY,
      APP_CONSTANTS.USER_KEY,
      APP_CONSTANTS.REFRESH_TOKEN_KEY,
    ]);
  } catch (error) {
    console.error('Failed to clear storage:', error);
    throw error;
  }
}

export async function storeRefreshToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(APP_CONSTANTS.REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to store refresh token:', error);
    throw error;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(APP_CONSTANTS.REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
}
