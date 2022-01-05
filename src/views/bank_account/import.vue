<template>
    <CCard>
        <CCardHeader class="bg-white">Import Excel</CCardHeader>
        <CCardBody>
            <router-link :to="{ name: 'Bank Account' }">
            <CButton color="primary">
                <CIcon class="text-white" name="cil-arrow-left" /> Back
            </CButton>
            </router-link>
            <CForm class="mt-3" @submit.prevent="submit">
                <div class="mb-3">
                    <CFormLabel for="file">Upload File</CFormLabel>
                    <CFormInput type="file" id="file" @change="setFile" />
                    <div v-if="fileEmpty" class="text-danger">{{ fileEmpty.message }}</div>
                </div>
                <CButton type="submit" color="primary">Import</CButton>
            </CForm>
        </CCardBody>
    </CCard>
</template>

<script>
    import { ref } from 'vue'
    import XLSX from 'xlsx'
    import axios from 'axios'
    import router from '../../router'

    export default {
        setup() {
            const file = ref()
            const fileEmpty = ref({})
            const setFile = e => {
                const excel = e.target.files[0]

                file.value = excel
            }
            const submit = () => {
                if (file.value) {
                    const reader = new FileReader()
                    reader.onload = e => {
                        const data = new Uint8Array(e.target.result)
                        const workbook = XLSX.read(data, { type: 'array' })
                        const worksheet = workbook.Sheets.Sheet1
                        const worksheetJson = XLSX.utils.sheet_to_json(worksheet)

                        for (const bank of worksheetJson) {
                            axios.post(`${process.env.VUE_APP_URL_API}/bank`, bank, {
                                headers: {
                                    Authorization: window.localStorage.getItem('accessToken')
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        }

                        router.push({ name: "Bank Account" })
                    }
                    reader.readAsArrayBuffer(file.value)
                } else {
                    fileEmpty.value.message = "File is required"
                }
            }

            return { file, fileEmpty, setFile, submit }
        }
    }
</script>