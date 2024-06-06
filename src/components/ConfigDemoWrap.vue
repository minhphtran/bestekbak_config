<!-- everything-->
<template>
  <transition name="demo">
    <div class="demo-mask">
      <div class="demo-wrapper" @click.self="close">
        <div
          class="demo-container"
          role="dialog"
          aria-labelledby="demoTitle"
          aria-describedby="demoDescription"
        >
          <header id="demoTitle" class="demo-header">
            <slot name="header">Preview</slot>
          </header>

          <section class="demo-body" id="demoDescription">
            <slot name="body"></slot>
          </section>

          <button
            type="button"
            aria-label="Close demo"
            class="demo-button"
            @click="close"
          >{{ $t("demo.button") }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import createFocusTrap from "focus-trap";

export default {
  data() {
    return {
      focusTrap: null
    };
  },
  mounted() {
    document.addEventListener("keydown", this.closeOnEsc);

    this.focusTrap = createFocusTrap(this.$el);
    this.focusTrap.activate();
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.closeOnEsc);

    this.focusTrap.deactivate();
  },
  methods: {
    closeOnEsc(event) {
      if (event.keyCode == 27) {
        this.close();
      }
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style>
.demo-mask {
	 position: fixed;
	 z-index: 100;
	 top: 0;
	 left: 0;
	 width: 100%;
	 height: 100%;
	 background-color: rgba(0, 0, 0, 0.7);
	 overflow: auto;
	 transition: opacity 0.25s ease;
}
.demo-wrapper{
  width:100%;
  height:100%;
  align-content: center;
}

.demo-container {
  width: 86%;
  height: 86%;
  top: 7%;
  left: 7%;
  position: relative;
  background-color: #f0f0f0;
  border-radius: 5px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease;
  border: 1px solid black;
  display: grid;
  grid-template-rows: repeat(9, 1fr);
}
 @media screen and (max-width: 700px) {
	 .demo-container {
		 padding: 0px 20px 20px;
		 width: calc(100% - 40px);
	}
}
.demo-header {
  font-size: 1.5em;
  text-align: center;
  width:100%;
  grid-area: 1 / 1 / 2 / 2;
}
.demo-body {
  grid-area: 2 / 1 / 9 / 2;
}
.demo-button {
  margin: 40px auto;
  display: table;
  grid-area: 9 / 1 / 10 / 2;
}
@media screen and (max-width: 700px) {
	 .demo-button {
		 margin: 20px auto 0;
	}
}
.demo-enter, .demo-leave-active {
	 opacity: 0;
}
.demo-enter .demo-container, .demo-leave-active .demo-container {
	 transform: scale(0.9);
}

</style>
