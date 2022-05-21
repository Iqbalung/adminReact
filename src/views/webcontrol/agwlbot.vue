<template>
  <div>
    <CCard class="mb-4">
      <CCardHeader class="bg-white">Agwl Bot
        <CButton
          size="sm"
          class="rounded d-inline-block p-0"
          color="secondary"
          variant="ghost"
          @click="test()"
        >
          <CIcon name="cil-copy" />
        </CButton>
      </CCardHeader>
      <CCardBody>
        <iframe
          src="https://agwlbot.my.id:8080/agwlmain/control"
          width="100%"
          height="500px"
          frameborder="0"
        ></iframe>
      </CCardBody>
    </CCard>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  setup(){
    async function test() {
      try {
        await axios.get('http://154.53.61.4:3010/')
        .then(res => {
          let result = {
            code : res.status,
            data : res.data
          }
          console.log(result)
        }).catch(err => {
          console.log(err)
        })
      } catch (e) {
        console.log(e)
      }
    }

    return {
      test
    }
  }
}
</script>
