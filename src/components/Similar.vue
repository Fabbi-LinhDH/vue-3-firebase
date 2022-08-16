<template>
  <div
    class="modal fade show"
    tabindex="-1"
    role="dialog"
    :style="'display: block'"
  >
    <div class="modal-dialog modal-custom" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="hideModal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
           DATA
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Similar",
  props: ["show"],
  data() {
    return {};
  },
  watch: {},
  methods: {
    hideModal() {
      this.$emit('on-hide')
    }
  },
  mounted() {},
};
</script>

<style>
</style>
