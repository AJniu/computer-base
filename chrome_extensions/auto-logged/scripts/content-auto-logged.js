const CONSTANTS = {
    scriptId: 'image-to-text-content-script',
    workerLanguage: ['eng'],
    textareaId: 'prompt-textarea',
    uploadButtonID: 'upload-button-image-to-text-extension',
    uploadButtonBGColor: '#343640',
    lightModeUploadButtonIcon: 'images/upload-icon-dark.png',
    darkModeUploadButtonIcon: 'images/upload-icon-light.png',
    defaultUploadButtonIcon: 'images/upload-icon-default.png',
    languageButtonIcon: 'images/languages-icon.png',
    flexBoxContainerId: 'flexbox-container-image-to-text-extension',
};

let initializingPromise = null;
let worker = null;
async function initialize() {
    if (initializingPromise) {
        // If initialization is already in progress, return the promise
        return initializingPromise;
    }

    initializingPromise = new Promise(async (resolve, reject) => {
        if (document.getElementById(CONSTANTS.scriptId)) {
            try {
                resolve();
            } catch (error) {
                console.error('Error initializing worker: ', error);
                reject(error);
            }
        } else {
            const script = document.createElement('script');
            script.id = CONSTANTS.scriptId;
            script.src = chrome.runtime.getURL('scripts/tesseract.min.js');
            (document.head || document.documentElement).appendChild(script);

            script.onload = async function () {
                try {
                    resolve();
                } catch (error) {
                    console.error('Error initializing worker: ', error);
                    reject(error);
                }
            };
        }
    }).finally(() => {
        initializingPromise = null;
    });
    return initializingPromise;
}

async function createWorker() {
    const worker = await Tesseract.createWorker('eng', 1, {
        workerPath: chrome.runtime.getURL(
            'scripts/tesseract.js@v5.0.4_dist_worker.min.js'
        ),
        corePath: chrome.runtime.getURL('scripts/'),
        langPath: chrome.runtime.getURL('scripts/languages/'),
        logger: (m) => {
            console.log(m);
        },
    });
    await worker.setParameters({
        preserve_interword_spaces: '1',
    });
    return worker;
}
(async () => {
    await initialize();
    worker = await createWorker();
})();
async function handleFile(file, worker) {
    try {
        (async () => {
            const { data } = await worker.recognize(file);
            console.log(data.text);
            // document.getElementById('user').value = 'SecAdmin';
            // document.getElementById('pwd').value = 'Admin@12345';
            // document.querySelector('codeForm').querySelector('input').value =
            //     data.text;
            // document.querySelector('.login_button').dispatchEvent(clickEv);
        })();
    } catch (error) {
        console.log('如果失败请刷新网页');
    }
}
const clickEv = new Event('click');
const app = document.querySelector('html');
// const img1 = document.querySelectorAll('img');
app.addEventListener('click', (e) => {
    console.log('e.target.querySelector(Img)');
    handleFile(e.target.querySelector('img'), worker);
});
