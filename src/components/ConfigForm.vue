<template>
  <aside>
<!--    <fieldset>-->
<!--      <label for="columns">{{ $t("form.columns") }}</label>-->
<!--      <input-->
<!--        id="columns"-->
<!--        type="number"-->
<!--        min="1"-->
<!--        max="10"-->
<!--        class="field"-->
<!--        @input="$store.commit(`updateColumns`, $event.target.value)"-->
<!--        :value="columns"-->
<!--      >-->
<!--    </fieldset>-->


<!--    <fieldset>-->
<!--      <label for="rows">{{ $t("form.rows") }}</label>-->
<!--      <input-->
<!--        id="rows"-->
<!--        type="number"-->
<!--        min="1"-->
<!--        max="10"-->
<!--        class="field"-->
<!--        @input="$store.commit(`updateRows`, $event.target.value)"-->
<!--        :value="rows"-->
<!--      >-->
<!--    </fieldset>-->

    <fieldset>
      <label for="thickness">{{ $t("form.thickness") }} <span class="label-extra-info">{{ $t("form.units") }}</span></label>
      <input
        id="thickness"
        type="number"
        min="0.1"
        max="2"
        step=".1"
        class="field"
        @input="$store.commit(`updateThickness`, $event.target.value)"
        :value="thickness"
      >
    </fieldset>

    <fieldset>
      <label for="height">{{ $t("form.height") }} <span class="label-extra-info">{{ $t("form.units") }}</span></label>
      <input
        id="height"
        type="number"
        min="0"
        max="100"
        class="field"
        @input="$store.commit(`updateHeight`, $event.target.value)"
        :value="height"
      >
    </fieldset>

    <fieldset>
      <label for="width">{{ $t("form.width") }} <span class="label-extra-info">{{ $t("form.units") }}</span></label>
      <input
        id="width"
        type="number"
        min="0"
        max="100"
        class="field"
        @input="$store.commit(`updateWidth`, $event.target.value)"
        :value="width"
      >
    </fieldset>

    <fieldset>
      <label for="depth">{{ $t("form.depth") }} <span class="label-extra-info">{{ $t("form.units") }}</span></label>
      <input
        id="depth"
        type="number"
        min="0"
        max="10"
        class="field"
        @input="$store.commit(`updateDepth`, $event.target.value)"
        :value="depth"
      >
    </fieldset>

    <button @click="generateGrid()">{{ $t("form.code_button") }}</button>
    <!-- <button type="reset" @click="$store.commit(`resetGrid`)">{{ $t("form.reset") }}</button> -->
    <div class="descr">
    <p>✎ add/remove cols/rows by side bar</p>
    <p>✎ change cols/rows size by number or dragging</p>
    <p>✎ press and drag to define sections</p>
    <p>✎ click x to remove sections</p>
    <p>✎ overlapping sections are obviously forbidden</p>
    <p>✎ click preview to show how it would look like</p>
    <p>✎ fr(ame) = equal division, click to change to cm</p>
    <p>✎ based on <i><a href="https://cssgrid-generator.netlify.app/" target="_blank">cssgrid-generator</a></i></p>
    </div>
    <config-demo-wrap v-if="showDemo" @close="showDemo = false">
      <template v-slot:header><h3>{{ $t("demo.header.title") }}</h3></template>
      <template v-slot:body>
        <config-demo/>
      </template>
    </config-demo-wrap>

  </aside>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import ConfigDemoWrap from "./ConfigDemoWrap.vue";
import ConfigDemo from "./ConfigDemo.vue";

export default {
  components: {
    ConfigDemoWrap,
    ConfigDemo
  },
  data() {
    return {
      showDemo: false
    };
  },
  computed: {
    ...mapState(["childarea", "columns", "rows", "thickness", "height", "width", "depth", "lineArr"]),
    ...mapGetters(["gridHeight", "gridWidth", "childArr", "colSize", "rowSize"])
  },
  watch: {
    // columns(newVal, oldVal) {
    //   let payload = {
    //     newVal,
    //     oldVal,
    //     direction: "colArr"
    //   };
    //   this.$store.commit("adjustArr", payload);
    // },
    // rows(newVal, oldVal) {
    //   let payload = {
    //     newVal,
    //     oldVal,
    //     direction: "rowArr"
    //   };
    //   this.$store.commit("adjustArr", payload);
    // }
  },
  methods: {
    computeSVGLines() {
      let halfstroke = this.thickness/2,
          rowranges = { ...Array.from({ length: this.rows + 1 }, () => []) },
          colranges = { ...Array.from({ length: this.columns + 1 }, () => []) },
          rowsizes = this.accumulateSize(this.rowSize.cmArr),
          colsizes = this.accumulateSize(this.colSize.cmArr),
          rowlines = [
              {x1: 0, y1: halfstroke, x2: this.gridWidth, y2: halfstroke},
              {x1: 0, y1: this.gridHeight - halfstroke, x2: this.gridWidth, y2: this.gridHeight - halfstroke},
              ],
          collines = [
              // {x1: halfstroke, y1: 0, x2: halfstroke, y2: this.gridHeight},
              // {x1: this.gridWidth - halfstroke, y1: 0, x2: this.gridWidth - halfstroke, y2: this.gridHeight},
              {x1: halfstroke, y1: 0, x2: halfstroke, y2: this.gridHeight},
              {x1: this.gridWidth - halfstroke, y1: 0, x2: this.gridWidth - halfstroke, y2: this.gridHeight},
              ]

      for (let i = 0; i < this.childarea.length; i++) {
        let [sr, sc, er, ec] = this.childarea[i].split(' / ').map(e => parseInt(e) - 1)
        rowranges[sr].push([sc,ec]); rowranges[er].push([sc,ec]);
        colranges[sc].push([sr,er]); colranges[ec].push([sr,er]);
      }
      //   Object.keys(rowranges).forEach((k) => rowranges[k] = merge(rowranges[k]));
      //   Object.keys(colranges).forEach((k) => colranges[k] = merge(colranges[k]));

      for (let r = 1; r < this.rows; r++) {
        var r_y = halfstroke + rowsizes[r],
            rlinegr = this.merge(rowranges[r])
        for (const rl of rlinegr) {
          rowlines.push({
            x1: colsizes[rl[0]],
            y1: r_y,
            x2: colsizes[rl[1]] + this.thickness,
            y2: r_y
          })
        }
      }

      for (let c = 1; c < this.columns; c++) {
        var c_x = halfstroke + colsizes[c],
            clinegr = this.merge(colranges[c])
        for (const cl of clinegr) {
          collines.push({
            x1: c_x,
            y1: rowsizes[cl[0]],
            x2: c_x,
            y2: rowsizes[cl[1]] + this.thickness
          })
        }
      }
      // console.log(rowlines)
      // console.log(collines)
      return rowlines.concat(collines)
    },
    compute3DLines() {
      console.log(this.thickness)
      let halfstroke = this.thickness/2,
          rowranges = { ...Array.from({ length: this.rows + 1 }, () => []) },
          colranges = { ...Array.from({ length: this.columns + 1 }, () => []) },
          rowsizes = this.accumulateSize(this.rowSize.cmArr),
          colsizes = this.accumulateSize(this.colSize.cmArr),
          rowlines = [
            {x: this.gridWidth, y: this.thickness,
              posx: 0, posy: (- this.gridHeight + this.thickness) / 2},
            {x: this.gridWidth, y: this.thickness,
              posx: 0, posy: (this.gridHeight - this.thickness) / 2}
          ],
          collines = [
              {x: this.thickness, y: this.gridHeight - 2 * this.thickness,
              posx: (- this.gridWidth + this.thickness)/2, posy: 0},
              {x: this.thickness, y: this.gridHeight - 2 * this.thickness,
              posx: (this.gridWidth - this.thickness)/2, posy: 0},
          ]

      for (let i = 0; i < this.childarea.length; i++) {
        // let [sr, sc, er, ec] = this.childarea[i].split(' / ').map(e => parseInt(e) - 1)
        let child = this.childarea[i]
        rowranges[child.sr].push([child.sc, child.ec]); rowranges[child.er].push([child.sc, child.ec]);
        colranges[child.sc].push([child.sr, child.er]); colranges[child.ec].push([child.sr, child.er]);
      }
      // (l.x2 - l.x1), (l.y2 - l.y1 + stroke), depth, l.x1 - (boxw-l.x2 + l.x1)/2, l.y1-(boxh - l.y2 + l.y1)/2, halfdepth)
      for (let r = 1; r < this.rows; r++) {
        var r_y = halfstroke + rowsizes[r],
            rlinegr = this.merge(rowranges[r])
        for (const rl of rlinegr) {
          rowlines.push({
            x: colsizes[rl[1]] - colsizes[rl[0]] + this.thickness,
            y: this.thickness,
            posx: colsizes[rl[0]]/2 + halfstroke - (this.gridWidth - colsizes[rl[1]])/2,
            posy: this.gridHeight/2 - r_y
          })
        }
      }
      // (l.x2 - l.x1 + stroke), (l.y2 - l.y1), depth, l.x1 - (boxw-l.x2 + l.x1)/2, l.y1-(boxh - l.y2 + l.y1)/2, halfdepth)
      for (let c = 1; c < this.columns; c++) {
        var c_x = halfstroke + colsizes[c],
            clinegr = this.merge(colranges[c])
        for (const cl of clinegr) {
          collines.push({
            x: this.thickness,
            y: rowsizes[cl[1]] - rowsizes[cl[0]] - this.thickness,
            posx: - this.gridWidth/2 + c_x ,
            posy: - rowsizes[cl[0]]/2 - halfstroke + (this.gridHeight - rowsizes[cl[1]])/2
          })
        }
      }
      // console.log(rowlines)
      // console.log(collines)
      return rowlines.concat(collines)
    },

    merge(ranges){
      var result = [], last;
      let sorted = ranges.sort(
          function(a, b) { return a[0]-b[0] || a[1]-b[1] }
      );
      for (const r of sorted){
        if (!last || r[0] > last[1])
              result.push(last = r);
          else if (r[1] > last[1])
              last[1] = r[1];
      }
      return result;
    },
    accumulateSize(sizeArr){
      let arr = sizeArr.map(
              (sum => value => sum += (value + this.thickness))(0)
          )
      arr.splice(0,0,0);
      return arr
    },
    generateGrid() {
      let result = this.compute3DLines()
      this.$store.commit("updateLines", result);

      this.showDemo = true;
    }
  }
};
</script>

<style>
aside {
  margin-top: 60px;
  font-size: 17px;
  width: 30vw;
}

label {
	 padding-right: 18px;
	 display: inline-block;
	 width: 150px;
}
 label .label-extra-info {
	 opacity: 0.7;
}
.field {
	 font-size: 15px;
	 background: #f0f0f0;
	 color: #161825;
	 width: 40px;
	 padding: 0.3ch 5px;
	 max-height: 40px;
	 border: none;
}
fieldset {
	 margin-bottom: 20px;
	 border: none;
	 margin: 0;
	 padding: 5px 0;
}

 [type="reset"] {
	 color: #565656;
	 border: 1px solid #565656;
}
 [type="reset"]:hover {
	 background: #565656;
	 color: black;
}

.descr{
  font-size: 13px;
  margin-top: 45px;
}

@media screen and (max-width: 700px) {
  aside {
    width: 80vw;
    margin-left: 75px;
    margin-top: 0;
  }
  button[type=reset]{
    margin-left: 20px;

  }
}
</style>