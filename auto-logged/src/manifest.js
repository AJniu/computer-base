import pkg from '../package.json'

const manifest = {
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  host_permissions: ['*://*/*'],
  background: {
    service_worker: 'src/entries/background/main.js',
  },
  action: {
    default_popup: 'src/entries/popup/index.html',
  },
  options_ui: {
    page: 'src/entries/options/index.html',
    open_in_tab: false,
  },
  content_scripts: [
    {
      matches: ["http://*/*","https://*/*"],
      js: ["src/entries/background/content-script.js"],
      run_at: "document_end",
    }
  ],
}

export default manifest