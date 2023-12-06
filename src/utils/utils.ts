export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function objectToQueryString(obj: any) {
  const keys = Object.keys(obj);
  const keyValuePairs = keys.map(key => {
    return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
  });
  return keyValuePairs.join('&');
}