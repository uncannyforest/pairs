const getObj = function(key) {
  let stringCookies = '; ' + document.cookie;
  let parts = stringCookies.split(`; ${key}=`);
  if (parts.length === 2) {
    return JSON.parse(parts[1].split(';')[0]);
  }
};

const setObj = function(key, value) {
  let stringValue = JSON.stringify(value);

  let cookieExpiration = new Date();
  cookieExpiration.setFullYear(cookieExpiration.getFullYear() + 1);
  document.cookie = `${key}=${stringValue}; expires=${cookieExpiration.toUTCString()};`;
};

export { getObj, setObj };
