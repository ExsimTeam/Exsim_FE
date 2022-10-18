/**
 * This file defines some funtions to operate on local storage.
 */

/**
 * Remove data from local storage.
 * @param key The key.
 */
 export const removeData = (key: string) => {
    localStorage.removeItem(key);
  }
  
  /**
  * Get data from local storage.
  * @param key The key.
  * @returns The data.
  */
  export const getData = (key: string) => {
    return localStorage.getItem(key);
  }
  
  /**
  * Save data to local storage.
  * @param key The key.
  * @param value The data.
  */
  export const setData = (key: string, value: string) => {
    localStorage.setItem(key, value);
  }
  
  /**
  * Clear local storage.
  */
  export const clearData = () => {
    localStorage.clear();
  }
  