<template>
  <div class="preview-canvas" ref="prevcanvas">
    <Renderer ref="renderer" antialias :orbit-ctrl="{ enableDamping: true, dampingFactor: 0.05 }" resize>
      <Camera :position="{ z: 70 }" />
      <Scene background="#f0f0f0">
        <AmbientLight color="#808080" :intensity="1"/>
        <PointLight :position="{ y: 10, z: 10 }" :intensity="0.15"/>
        <Mesh :position="{x:0, y:0, z: -thickness/2}">
          <BoxGeometry :width="gridWidth" :height="gridHeight" :depth="thickness"/>
          <PhongMaterial :props="{ ...matProps }"><Texture v-bind:src="texture"/></PhongMaterial>
        </Mesh>
        <Mesh v-for="(line, i) in lineArr" :key="i" :ref="`mesh${i}`"
              :position="{x:line.posx, y:line.posy, z: depth/2}"
        >
          <BoxGeometry :width="line.x" :height="line.y" :depth="depth"/>
          <PhongMaterial :props="{ ...matProps }"><Texture v-bind:src="texture"/></PhongMaterial>
        </Mesh>

      </Scene>
    </Renderer>
  </div>
</template>

<script>
import Tweakpane from 'tweakpane';
import { DoubleSide } from 'three';
import {
  Camera,
  Renderer,
  Scene,
  Mesh,
  BoxGeometry,
  PhongMaterial,
  Texture,
  AmbientLight,
  PointLight
} from 'troisjs';
import {mapGetters, mapState} from "vuex";

const textures= {
  'Beech': "/textures/beech/texture.jpg",
  'Oak': "/textures/oak/texture.jpg",
  'Nut': "/textures/nut/texture.jpg"
};

export default {
  components: {
    Camera,
    Renderer,
    Scene,
    Mesh,
    BoxGeometry,
    PhongMaterial,
    Texture,
    AmbientLight,
    PointLight,
  },
  data() {
    return {
      texture: textures['Oak'],
      depth: 5,
      matProps: {displacementScale: 0.2, side: DoubleSide},
    };
  },
  computed: {
    ...mapState(["lineArr", "thickness"]),
    ...mapGetters(["gridHeight", "gridWidth"])
  },
  mounted() {
    this.pane = new Tweakpane({container: this.$refs.prevcanvas});
    this.pane.addInput(this, 'texture', { options: textures} );
    this.pane.addInput(this, 'depth', {min: 1, max: 10, step: .1});
    const renderer = this.$refs.renderer;
  },
  unmounted() {
    this.pane.dispose();
  },
  methods: {
  },
};
</script>

<style>
.preview-canvas {
  height: 100%;
  position: relative;
  overflow-y: scroll;
  p {
    margin: 5px;
  }
}

canvas{
  position: absolute;
}

/*tweakpane*/
.tp-rotv {
  width:250px;
  margin-top: 0;
  left: 8px;
  background-color: transparent!important;
  right: auto!important;
}
@media (min-width: 720px) {
  .tp-rotv {
    margin-left: 5.4rem;
  }
}

</style>