<script setup>

import { OCRClient } from 'tesseract-wasm'
import { ref } from 'vue';
let url = ref('../../../public/eng-bw.jpg')
async function runOCR() {
  // Fetch document image and decode it into an ImageBitmap.
  const imageResponse = await fetch(url)
  const imageBlob = await imageResponse.blob()
  const image = await createImageBitmap(imageBlob)

  // Initialize the OCR engine. This will start a Web Worker to do the
  // work in the background.
  const ocr = new OCRClient()
  await ocr.loadModel('eng.traineddata')

  await ocr.loadImage(image)

  // Perform text recognition and return text in reading order.
  const text = await ocr.getText()

  console.log('OCR text: ', text)
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

console.log('OCR text: ----')
// runOCR()
</script>

<template>
  <img :src="url" alt="" srcset="">
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
