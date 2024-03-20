<template>
  <el-form
    ref="loginFormRef"
    style="width: 400px"
    :model="loginForm"
    status-icon
    label-width="auto"
  >
    <el-form-item label="userName" prop="userName">
      <el-select v-model="loginForm.userName" placeholder="please select">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>

    <el-form-item label="password" prop="password">
      <el-select v-model="loginForm.password" placeholder="please select">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>

    <el-form-item label="code" prop="imageCode">
      <el-input v-model="loginForm.imageCode" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(loginFormRef)"
        >Submit</el-button
      >
      <el-button @click="resetForm(loginFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import cv from 'opencv-ts'
import type { FormInstance } from 'element-plus'

const loginFormRef = ref<FormInstance>()

const loginForm = reactive({
  userName: '',
  password: '',
  imageCode: '',
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const processImage = () => {
  // const imgElement = document.getElementById('image');
  const src = cv.imread('https://tesseract.projectnaptha.com/img/eng_bw.png')
  const dst = new cv.Mat()

  cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY)

  //   cv.imshow('output', dst)
  src.delete()
  dst.delete()
  console.log(dst)
}
console.log('opencv run')
processImage()
</script>

<style scoped></style>
