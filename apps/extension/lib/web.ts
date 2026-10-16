// Pages of the Notebase web app, which the popup opens in a new tab
export const webUrl = (path: string) => `${import.meta.env.WXT_API_URL}${path}`;

export function openWebPage(path: string) {
  return browser.tabs.create({ url: webUrl(path) });
}
