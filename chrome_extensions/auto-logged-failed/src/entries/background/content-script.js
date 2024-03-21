// 插入页面的js,与打开页面公用一个dom，但js隔离
// const img1 = document.getElementById('img1');
// console.log(img1);

async function runOCR() {
    // Fetch document image and decode it into an ImageBitmap.
    // const imageResponse = await fetch('/public/eng-bw.jpg');
    // const imageBlob = await imageResponse.blob();
    // console.log(`imageBlob`, imageBlob);

    // await chrome.runtime.sendMessage({ imgRes: imageBlob });
    // chrome.runtime.sendMessage({ imgRes: 'Hello from content script!' });
    // await chrome.runtime.sendMessage({
    //     imgRes: location.href,
    //     from: 'content-script.js',
    // });
    const img1 = document.getElementById('img1');
    await chrome.runtime.sendMessage({
        imgRes: img1.src,
        from: 'content-script.js',
    });
    // const image = await createImageBitmap(imageBlob);

    // // Initialize the OCR engine. This will start a Web Worker to do the
    // // work in the background.
    // const ocr = new OCRClient();
    // await ocr.loadModel('eng.traineddata');

    // await ocr.loadImage(image);

    // // Perform text recognition and return text in reading order.
    // imgRes = await ocr.getText();

    // console.log('OCR text: ', imgRes);
    // try {
    //   // Load the appropriate OCR training data for the image(s) we want to
    //   // process.
    //   await ocr.loadModel('eng.traineddata')

    //   await ocr.loadImage(image)

    //   // Perform text recognition and return text in reading order.
    //   const text = await ocr.getText()

    //   console.log('OCR text: ', text)
    // } finally {
    //   // Once all OCR-ing has been done, shut down the Web Worker and free up
    //   // resources.
    //   ocr.destroy()
    // }
}

runOCR();
