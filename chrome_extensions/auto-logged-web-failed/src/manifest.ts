import pkg from '../package.json'

const manifest: chrome.runtime.Manifest = {
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  host_permissions: ['*://*/*'],
  background: {
    service_worker: 'src/entries/background/main.ts',
  },
  action: {
    default_popup: 'src/entries/popup/index.html',
  },
  options_ui: {
    page: 'src/entries/options/index.html',
    open_in_tab: false,
  },
  permissions: [
    'activeTab',
    'tabs',
    'storage',
    'contextMenus',
    'clipboardRead',
    'clipboardWrite',
    'unlimitedStorage',
  ],
  content_security_policy: {
    extension_pages: "script-src 'self' ; object-src 'self'",
  },
}

export default manifest
