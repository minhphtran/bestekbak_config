<template>
  <main @mouseleave="clearPath" @mouseup="clearPath">

<!--    column array-->
    <section
      :style="{ gridTemplateRows: '50px'}"
      class="colunits"
    >
      <div v-for="(col, i) in colArr" :key="i">
        <div :class="['grid-field']">
          <input v-model.lazy="col.val">
          <input
            v-model="col.unit"
            type="button"
            aria-label="Column Config"
            @click="swapUnitCol($event.target, i)"
          >
        </div>
        <button @click="$store.commit(`removeCol`, i)" class="grid-button grid-template">&minus;</button>
        <button @click="$store.commit(`addCol`, i)" class="grid-button grid-template">&plus;</button>
      </div>
    </section>

<!--    row array -->
    <section
      :style="{ gridTemplateColumns: '50px'}"
      class="rowunits"
    >
      <div v-for="(row, i) in rowArr" :key="i">
        <div class="grid-field">
          <input v-model.lazy="row.val" type="text">
          <input
            v-model="row.unit"
            type="button"
            aria-label="Row Config"
            @click="swapUnitRow($event.target, i)"
          >
        </div>
        <button @click="$store.commit(`removeRow`, i)" class="grid-button grid-template">&minus;</button>
        <button @click="$store.commit(`addRow`, i)" class="grid-button grid-template">&plus;</button>
      </div>
    </section>

<!--    THE grid -->
    <div
        id="gridcontainer"
        :style="{paddingBottom:  gridRatio * 100 + '%'}"
        @mousemove="dragging"
        @touchmove="dragging"
        @mouseup="dragUp"
        @mouseleave="dragUp"
        @touchend="dragUp"
        @touchcancel="dragUp"
        @touchstart="dragUp"
        >
      <section
        class="grid"
        @touchstart.prevent="delegatedTouchPlaceChild"
        @touchend.prevent="delegatedTouchPlaceChild"
      >
        <div
          v-for="(item, i) in divNum"
          :key="i"
          :id="item"
          :class="'box' + i"
          :data-row="rowIndex(i)"
          :data-col="colIndex(i)"
          :style="{ background: boxColor(i), resize: 'both' }"
          @mousedown="placeChild(i, 's', $event.target.dataset)"
          @mouseover="checkChild($event.target.dataset)"
          @mouseup="placeChild(i, 'e', $event.target.dataset)"
        ></div>
      </section>
      <section
        class="grid gridchild"
      >
        <div
          v-for="(child, i) in childarea"
          :key="child"
          :class="'child' + i"
          :style="{
            // gridArea: child,
            gridRowStart: child.sr + 1,
            gridColumnStart: child.sc + 1,
            gridRowEnd: child.er + 1,
            gridColumnEnd: child.ec + 1,
            display: 'flex'}"
        >
          <button class="grid-button" :style="{position: 'absolute'}"
                  @click="removeChild(i)">&times;</button>
          <p :style="{color: '#f8f8f8'}">{{ sizeChild(child) }}</p>
        </div>

<!--        lines-->
        <div
            v-for="(col, i) in colArr.slice(0,-1)"
            class="grid-line col"
            :key="col"
            :style="{
              gridRowStart: 1,
              gridRowEnd: rows+1,
              gridColumnStart: i+1,
              gridColumnEnd: i+2,
            }"
        >
          <div class="line-handle col"
               @mousedown="dragDown($event, i, 'c')"
               @touchstart="dragDown($event, i, 'c')"
               @touchend="dragUp($event)"
          ></div>
        </div>
        <div
            v-for="(row, i) in rowArr.slice(0,-1)"
            class="grid-line row"
            :key="row"
            :style="{
              gridRowStart: i+1,
              gridRowEnd: i+2,
              gridColumnStart: 1,
              gridColumnEnd: columns+1,
            }"
        >
          <div class="line-handle row"
               @mousedown="dragDown($event, i, 'r')"
               @touchstart="dragDown($event, i, 'r')"
               @touchend="dragUp($event)"
          ></div>
        </div>

      </section>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapState } from "vuex";

function addEvents(events) {
    events.forEach((cb, eventName) => {
        document.documentElement.addEventListener(eventName, cb);
    });
}

function removeEvents(events) {
    events.forEach((cb, eventName) => {
        document.documentElement.removeEventListener(eventName, cb);
    });
}

const constraints = {
  'cm': 5,
  'fr': 0.1 //should calculate in sizecalc
}

export default {
  data() {
    return {
      child: {
        srow:null, scol: null, erow: null, ecol: null,
        item: -1
      },
      line:{
        // active: 0,
        pos: -1,
        drag: false,
        id: -1,
        direction: null,
      },
      path: {
        children: [],
        overlap: []
      },
      gridwidth: 0,
      pxsize: 0,
    };
  },
  computed: {
    ...mapState([
      "thickness",
      "colArr",
      "rowArr",
      "childArr",
      "columns",
      "rows",
      "childarea"
    ]),
    ...mapGetters(["gridRatio", "gridWidth", "gridHeight", "divNum", "rowTemplate", "colTemplate", "colSize", "rowSize"])
  },
  methods: {
    dragDown(event, i, dir){
      // this.line.active = (this.line.active != 1);
      this.line.drag = true;
      this.line.id = i;
      this.line.direction = dir;
      this.line.pos =  dir === 'c' ? event.clientX : event.clientY;
    },

    dragUp(){
      this.line.drag = false;
    },
    dragging(event){
      if (!this.line.drag) {
        return;
      }
      let id = this.line.id, arr, distance_cm, distance_fr, new_pos;

      if (this.line.direction === 'c') {
        arr = this.colArr; new_pos = event.clientX
        distance_cm = (new_pos - this.line.pos) * this.pxsize;
        distance_fr = distance_cm / this.colSize.frSize;
      } else {
        arr = this.rowArr; new_pos = event.clientY
        distance_cm = (new_pos - this.line.pos) * this.pxsize;
        distance_fr = distance_cm / this.rowSize.frSize;
      }

      let distance = {'cm': distance_cm, 'fr': distance_fr},
          new_child = parseFloat(arr[id].val) + distance[arr[id].unit],
          new_child_next = parseFloat(arr[id + 1].val) - distance[arr[id+1].unit];

      if (new_child > constraints[arr[id].unit] && new_child_next > constraints[arr[id+1].unit]) {
        arr[id].val = new_child;
        arr[id + 1].val = new_child_next;
        this.line.pos = new_pos;
      }
    },
    delegatedTouchPlaceChild(ev) {
      const target = document.elementFromPoint(
        ev.changedTouches[0].clientX,
        ev.changedTouches[0].clientY
      );
      const startend = ev.type === "touchstart" ? "s" : "e";
      this.placeChild(target.dataset.id, startend);
    },
    rowIndex(i) {
      return parseInt(i / this.columns);
    },
    colIndex(i) {
      return i  % this.columns ;
    },
    boxColor(i) {
      if (this.path.overlap.indexOf(i) !== -1) {
        return '#731010'
      } else if (this.path.children.indexOf(i) !== -1) {
        return '#2c5f2d'
      } else return 'transparent'
    },

    swapUnitCol(target, i) {
      let colitem = this.colArr[i]
      console.log(target.value);
      if (target.value === 'fr') {
        colitem.val = Math.round(this.colSize.cmArr[i] * 100) / 100;
        colitem.unit = 'cm';
      } else {
        colitem.val = Math.round(this.colSize.frArr[i] * 100) / 100;
        colitem.unit = 'fr';
      }
    },
    swapUnitRow(target, i) {
      let rowitem = this.rowArr[i]
      if (target.value === 'fr') {
        rowitem.val = Math.round(this.rowSize.cmArr[i] * 100) / 100;
        rowitem.unit = 'cm';
      } else {
        rowitem.val = Math.round(this.rowSize.frArr[i] * 100) / 100;
        rowitem.unit = 'fr';
      }
    },

    clearPath() {
      this.path = {children: [], overlap: []};
      this.child.item = -1;
    },
    getPath(sr, er, sc, ec, place = 0) {
      let [startRow, endRow] = sr <= er ? [sr, er] : [er, sr];
      let [startCol, endCol] = sc <= ec ? [sc, ec] : [ec, sc];

      this.path = {children: [], overlap: []};
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          let cur = c + r * this.columns
          if (this.$store.state.childArr[cur] < 0) {
            this.path.children.push(cur)
          } else this.path.overlap.push(cur)
        }
      }

      if (place > 0) {
        // this.child.cssstring = `${startRow + 1} / ${startCol + 1} / ${endRow + 2} / ${endCol + 2}`;
        this.child.gridarea = {sr: startRow , sc: startCol, er: endRow + 1, ec: endCol + 1}
      }
    },
    sizeChild(child) {
      // let [sr, sc, er, ec] = cssstring.split(' / ').map(e => parseInt(e) - 1)
      let csz = Math.round(
          (this.colSize.cmArr.slice(child.sc, child.ec).reduce(
              (a, b) => a + b, 0) + (child.ec - child.sc - 1) * this.thickness
          ) * 10) / 10,
          rsz = Math.round(
              (this.rowSize.cmArr.slice(child.sr, child.er).reduce(
                  (a, b) => a + b, 0) + (child.er - child.sr - 1) * this.thickness
              ) * 10) / 10
      return `${rsz}⨯${csz}`
    },
    placeChild(i, startend, data) {
      if (this.line.drag) {
        return;
      }
      // item, row, col start from 1, for css grid
      this.child[`${startend}row`] = parseInt(data.row);
      this.child[`${startend}col`] = parseInt(data.col);
      //create the children css units as a string
      if (startend === "e" && this.child.item > -1) {
        this.getPath(this.child.srow, this.child.erow, this.child.scol, this.child.ecol, 1)
        if (this.path.overlap.length === 0) {
          this.$store.commit("addChildren", this.child.gridarea);
          this.$store.commit("logChildren", this.path.children);
        }
        this.clearPath()
      } else {
        this.child.item = i;
        if (this.childArr[i] < 0) {
          this.path.children.push(i)
        } else this.path.overlap.push(i)
      }
    },
    checkChild(data) {
      if(this.child.item > -1) {
          let sr = this.child.srow, sc =  this.child.scol,
              er = parseInt(data.row), ec = parseInt(data.col)
          this.getPath(sr, er, sc, ec)
      }
    },
    removeChild(index) {
      this.$store.commit("removeChildren", index);
      this.$store.commit("unlogChildren", index);
    },
    handleResize() {
      // this.window.width = window.innerWidth;
      this.gridwidth = window.innerWidth * .65 - 50
      this.pxsize = this.gridWidth/this.gridwidth;
    }


  },
  mounted() {
    // this.domEvents = new Map([
    //         ['mousemove', this.dragging],
    //         ['mouseup', this.dragUp],
    //         ['mouseleave', this.dragUp],
    //         ['touchmove', this.dragging],
    //         ['touchend', this.dragUp],
    //         ['touchcancel', this.dragUp],
    //         ['touchstart', this.dragUp],
    //     ]);
    // addEvents(this.domEvents);
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    // removeEvents(this.domEvents);
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>

<style>
main {
	 /*--gridwidth: calc(65vw - 50px);*/
   --gridwidth: calc( 1px * v-bind('gridwidth'));
	 --gap: calc(var(--gridwidth) * v-bind('thickness')/v-bind('gridWidth'));
	 --colorGrid: #8D7B68;
	 width: var(--gridwidth);
	 height: calc(var(--gridwidth) * v-bind('gridRatio'));
	 margin: 15px 0 0 75px;
   padding: 0 70px 70px 35px;
}

.gridchild > * {
	 background-color: var(--colorGrid);
}
.gridchild {
	 counter-reset: step;
}
.gridchild div {
	 position: relative;
}
.gridchild div:before {
	 position: absolute;
	 display: block;
	 padding: 0 5px;
	 text-align: center;
	 color: white;
}
.grid-button {
	 /*position: absolute;*/
	 right: 0;
	 padding: 0 5px;
	 margin: 0;
	 color: #161825;
	 background-color: transparent;
	 border: none;
	 z-index: 99999;
   display:inline-block;
}
.grid-button:hover {
   background-color: transparent;
   color: inherit;
 }

#gridcontainer {
	 width: 100%;
	 z-index: 0;
	 position: relative;
	 background: #444444;
	 box-shadow: 0 2px 5px 0 #000;
}
.grid {
	 width: 100%;
	 height: 100%;
	 position: absolute;
	 display: grid;
	 grid-auto-flow: row dense;
	 grid-template-columns: v-bind('colTemplate');
	 grid-template-rows: v-bind('rowTemplate');
	 grid-gap: var(--gap);
	 padding: var(--gap);
	 box-sizing: border-box;
   -webkit-touch-callout: none; /* iOS Safari */
   -webkit-user-select: none; /* Safari */
   -moz-user-select: none; /* Old versions of Firefox */
   -ms-user-select: none; /* Internet Explorer/Edge */
   user-select: none;
}
.grid p {
	 padding-left: 2px;
	 margin: 0;
   font-size: 12px;
	 position: absolute;
	 color: #161825;
}
.grid div[class*="box"] {
	 border: 1px dotted var(--colorGrid);
	 transition: 0.2s all ease;
	 cursor: move;
	 position: relative;
	 z-index: 1000;
	 opacity: 0.5;
}
.rowunits, .colunits {
	 display: grid;
	 grid-template-columns: v-bind('colTemplate');
}
.rowunits div, .colunits div {
	 text-align: center;
	 position: relative;
}
.rowunits {
	 margin-left: -70px;
	 float: left;
	 height: calc(100% - 50px);
	 grid-template-rows: v-bind('rowTemplate');
}
.rowunits div {
	 align-self: center;
}

 @media screen and (max-width: 768px) {
	 * {
		 --gridwidth: calc(80vw - 50px);
	}
}

/*fields*/
.grid-field {
  /*width:50px;*/
}
.grid-field > input {
  width: 50px;
}
.grid-field > input[type=button] {
  width: 15px;
}
.grid-template{
  opacity: .5;
}
.grid-template:hover{
  opacity: 1;
  font-weight: bold;
}


/*lines*/
.grid-line{
  background: transparent;
  touch-action: none;
  pointer-events: initial;
}
.grid-line .col{
  z-index: 10;
  width: var(--gap);
  height: 100%;
  bottom: 0;
  left: 100%;
  cursor: col-resize;
}
.grid-line .row{
  z-index: 10;
  height: var(--gap);
  width: 100%;
  left: 0;
  top: 100%;
  cursor: row-resize;
}
.line-handle{
  position: absolute !important;
}

</style>