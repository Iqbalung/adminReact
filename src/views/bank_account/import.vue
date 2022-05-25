<template>
    <CCard>
        <CCardHeader class="bg-white d-flex align-items-center justify-content-between">
            Import Excel
            <CButton color="success" size="sm" v-on:click="downloadTemplate">
                Download Template Data Bank
            </CButton>
        </CCardHeader>
        <CCardBody>
            <router-link :to="{ name: 'Bank Account' }">
            <CButton color="primary">
                <CIcon class="text-white" name="cil-arrow-left" /> Back
            </CButton>
            </router-link>
            <CForm class="mt-3" @submit.prevent="submit(successFeedback)">
                <div class="mb-3">
                    <CFormLabel for="file">Upload File</CFormLabel>
                    <CFormInput type="file" id="file" @change="setFile" :invalid="error !== ''" />
                    <CFormFeedback v-if="error !== ''" invalid>{{ error }}</CFormFeedback>
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
    import VueSweetalert2 from 'vue-sweetalert2'

    export default {
        components: { VueSweetalert2 },
        methods: {
            successFeedback(cb) {
              this.$swal({
                title:'Banks Imported',
                icon:'success',
                confirmButtonText: 'Ok'
              }).then(res => {
                if (res.isConfirmed) {
                    cb()
                }
              })
            },
            downloadTemplate() {
                window.open(`${process.env.VUE_APP_URL_API}/template-import-bank.xlsx`)
            }
        },
        setup() {
            const error = ref('')
            const file = ref()
            const setFile = e => {
                const excel = e.target.files[0]

                file.value = excel
            }
            const submit = cb => {
                if (file.value) {
                    const reader = new FileReader()
                    reader.onload = e => {
                        const data = new Uint8Array(e.target.result)
                        try {
                            const workbook = XLSX.read(data, { type: 'array' })
                            const worksheet = workbook.Sheets.Sheet1
                            const worksheetJson = XLSX.utils.sheet_to_json(worksheet)

                            if (!worksheetJson.length) {
                                error.value = "File is invalid"
                            } else {
                                const imports = []

                                for (const bank of worksheetJson) {
                                    imports.push(axios.post(`${process.env.VUE_APP_URL_API}/bank`, {
                                        organization_id: window.localStorage.getItem('organization_id'),
                                        ...bank
                                    }, {
                                        headers: {
                                            Authorization: window.localStorage.getItem('accessToken')
                                        }
                                    }))
                                }

                                Promise.all(imports)
                                    .then(() => {
                                        cb(router.push({ name: "Bank Account" }))
                                    })
                                    .catch(err => {
                                        error.value = "File is invalid"
                                    })
                            }
                        } catch (err) {
                            error.value = err.message
                        }
                    }
                    reader.readAsArrayBuffer(file.value)
                } else {
                    error.value = "File is required"
                }
            }

            return { error, file, setFile, submit }
        }
    }
</script>