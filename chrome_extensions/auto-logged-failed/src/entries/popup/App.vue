<script setup>

// background.js 或者 popup.js
// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

    console.log('收到来自：', msg.from);
    console.log(msg.imgRes)
    // 使用 Tesseract.js 进行 OCR
    Tesseract.recognize(
        msg.imgRes, // 图像的 URL
        'eng', // 语言，这里使用英文
        { logger: (m) => console.log(m) } // 可选参数：日志输出
    ).then(({ data: { text } }) => {
        // 将识别结果显示在页面上
        // resultElement.textContent = text;
        console.log(text)
    });
    sendResponse('我是后台，我已收到你的消息：end');
});


// async function runOCR (imgRes) {
//     // Fetch document image and decode it into an ImageBitmap.
//     const imageResponse = await fetch(imgRes + '/public/eng-bw.jpg')
//     const imageBlob = await imageResponse.blob()
//     const image = await createImageBitmap(imageBlob)

//     // Initialize the OCR engine. This will start a Web Worker to do the
//     // work in the background.
//     const ocr = new OCRClient()
//     await ocr.loadModel('eng.traineddata')

//     await ocr.loadImage(image)

//     // Perform text recognition and return text in reading order.
//     const text = await ocr.getText()

//     console.log('OCR text: ', text)
//     // try {
//     //   // Load the appropriate OCR training data for the image(s) we want to
//     //   // process.
//     //   await ocr.loadModel('eng.traineddata')

//     //   await ocr.loadImage(image)

//     //   // Perform text recognition and return text in reading order.
//     //   const text = await ocr.getText()

//     //   console.log('OCR text: ', text)
//     // } finally {
//     //   // Once all OCR-ing has been done, shut down the Web Worker and free up
//     //   // resources.
//     //   ocr.destroy()
//     // }
// }

// console.log('OCR text: ----')
// runOCR()


</script>

<template>
    <img src="../../../public/eng-bw.jpg" alt="" srcset="">
</template>

<style scoped></style>
