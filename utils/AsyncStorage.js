import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_KEY } from '../config'

export const saveUserName = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(USER_KEY, jsonValue);
    return true;
  } catch (e) {
    console.error('Error al guardar usuario:', e);
    return false;
  }
};

export const loadUserName = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
    return false;
  } catch (e) {
    console.error('Error al cargar usuario:', e);
    return false;
  }
};

export const saveNumberOfMachines = async (key, value) => {
  try {
    await AsyncStorage.setItem
      (key, JSON.stringify(value));
    return true;
  }
  catch (e) {
    console.error('Error al guardar numero de maquinas:', e);
    return false;
  }
}

export const loadNumberOfMachines = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
    return false;
  } catch (e) {
    console.error('Error al cargar numero de maquinas:', e);
    return false;
  }
};

export const saveTrophyNumber = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  }
  catch (e) {
    console.error('Error al guardar numero de trofeos:', e);
    return false;
  }
}

export const loadTrophyNumber = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
    return false;
  } catch (e) {
    console.error('Error al cargar numero de trofeos:', e);
    return false;
  }
};

