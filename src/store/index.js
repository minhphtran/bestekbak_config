import { createStore } from 'vuex'
import { calcFrSize} from "../utils/sizecalc";
import { groupRepeatedUnits, createRepetition } from "../utils/repetition";

//default value
const ncol = 3;
const nrow = 3;

export default createStore({
  state: {
    columns: ncol,
    rows: nrow,
    thickness: .8,
    width: 40,
    height: 60,
    depth: 7,
    childArr: [],
    colArr: [],
    rowArr: [],
    childarea: [],
    lineArr: []
  },
  getters: {
    gridWidth(state) {
      return state.height < state.width ? state.width : state.height;
    },
    gridHeight(state) {
      return state.height < state.width ? state.height : state.width;
    },
    gridRatio(state, getters) {
      return (getters.gridHeight/getters.gridWidth);
    },
    divNum(state) {
      return getDivNum(state.columns, state.rows);
    },
    colSize(state, getters) {
      return calcFrSize(state.colArr, getters.gridWidth, state.thickness);
    },
    rowSize(state, getters) {
      return calcFrSize(state.rowArr, getters.gridHeight, state.thickness);
    },
    colTemplate(state, getters) {
      let unitTemplates = getters.colSize.frArr;
      const unitGroups = groupRepeatedUnits(unitTemplates);
      return createRepetition(unitGroups);
    },
    rowTemplate(state, getters) {
      let unitTemplates = getters.rowSize.frArr;
      const unitGroups = groupRepeatedUnits(unitTemplates);
      return createRepetition(unitGroups);
    },
  },
  mutations: {
    iniArr(state, payload) {
      if(payload !== '') {
        console.log('!',payload)
        const queryParams = new URLSearchParams(payload)

        for (const stateKey in state) {
          const paramIsValid = queryParams.has(stateKey)
          const paramType = typeof(state[stateKey])

          if(paramIsValid && paramType === 'number') {
            state[stateKey] = queryParams.get(stateKey);
          }
          else if (paramIsValid && paramType === 'object') {
            state[stateKey] = JSON.parse(queryParams.get(stateKey))
          }
        }
      } else {
          state.childArr = new Array(getDivNum(state.columns, state.rows)).fill(-1);
          createArr(state.columns, state.colArr);
          createArr(state.rows, state.rowArr);
      }
    },

    removeCol(state, payload) {
      state.columns -=1;
      state.colArr.splice(payload, 1)
      state.childArr = new Array(getDivNum(state.columns, state.rows)).fill(-1);
      state.childarea = state.childarea.filter(child => !((child.sc == payload) && (child.ec == (payload + 1))))
      for (let i = 0; i < state.childarea.length; i++) {
        let child = state.childarea[i];
        if (child.sc > payload) child.sc -= 1;
        if (child.ec > payload) child.ec -= 1;
        this.commit("updateLog", i);
      }
    },
    removeRow(state, payload) {
      state.rows -=1;
      state.rowArr.splice(payload, 1)
      state.childArr = new Array(getDivNum(state.columns, state.rows)).fill(-1);
      state.childarea = state.childarea.filter(child => !((child.sr == payload) && (child.er == (payload + 1))))
      for (let i = 0; i < state.childarea.length; i++) {
        let child = state.childarea[i];
        if (child.sr > payload) child.sr -= 1;
        if (child.er > payload) child.er -= 1;
        this.commit("updateLog", i);
      }
    },
    addCol(state, payload) {
      state.columns += 1;
      state.colArr.splice(payload + 1, 0, {unit: "fr", val: "1"});
      state.childArr = new Array(getDivNum(state.columns, state.rows)).fill(-1);
      for (let i = 0; i < state.childarea.length; i++) {
        let child = state.childarea[i];
        if (child.sc > payload) child.sc += 1;
        if (child.ec > payload + 1) child.ec += 1;
        this.commit("updateLog", i);
      }
    },
    addRow(state, payload) {
      state.rows += 1;
      state.rowArr.splice(payload + 1, 0, {unit: "fr", val: "1"});
      state.childArr = new Array(getDivNum(state.columns, state.rows)).fill(-1);
      for (let i = 0; i < state.childarea.length; i++) {
        let child = state.childarea[i];
        if (child.sr > payload) child.sr += 1;
        if (child.er > payload + 1) child.er += 1;
        this.commit("updateLog", i);
      }
    },
    updateLog(state, payload) {
      let child = state.childarea[payload];
      for (let r = child.sr; r < child.er; r++) {
        for (let c = child.sc; c < child.ec; c++) {
          state.childArr.splice(c + r * state.columns, 1, payload);
        }
      }
    },

    logChildren(state, payload) {
      let i = state.childarea.length - 1
      while(payload.length) {
        state.childArr.splice(payload.pop(), 1, i);
      }
    },
    unlogChildren(state, payload) {
      console.log(payload)
      var i = state.childArr.length;
      while (i--) {
          if (state.childArr[i] > payload) {
              state.childArr[i] -= 1;
          } else if (state.childArr[i] === payload) {
              state.childArr.splice(i, 1, -1);
          }
      }
    },

    addChildren(state, payload) {
      state.childarea.push(payload);
    },
    removeChildren(state, payload) {
      if (payload >= 0) {
        state.childarea.splice(payload, 1);
      }
    },

    updateThickness(state, payload) {
      state.thickness = parseFloat(payload);
    },

    updateHeight(state, payload) {
      state.height = parseFloat(payload);
    },

    updateWidth(state, payload) {
      state.width = parseFloat(payload);
    },

    updateDepth(state, payload) {
      state.depth = parseFloat(payload);
    },

    updateLines(state, payload) {
      state.lineArr = payload;
    },

    // resetGrid(state, payload) {
    //   state.rows = nrow;
    //   state.col = ncol;
    //   this.commit("clearGrid");
    //   this.commit("iniArr");
    // },
    resetGrid(state, payload) {
      state.childArr = new Array(getDivNum(state.columns, state.rows)).fill(-1)
      state.childarea = [];
    },

    // updateColumns(state, payload) {
    //   if (payload === '') return
    //   let diff = state.columns - parseInt(payload)
    //   for (let c = 1; c <= diff; c++) {
    //     for (let r = 0; r < state.rows; r++){
    //       let idx =  state.childArr[(r + 1) * state.columns - c]
    //       if (idx >= 0) {
    //         this.commit("removeChildren", idx );
    //         this.commit("unlogChildren", idx);
    //       }
    //     }
    //   }
    //
    //   var i = state.childArr.length;
    //   let new_childArr = new Array(getDivNum(payload, state.rows)).fill(-1);
    //   while (i--) {
    //     if (state.childArr[i] >= 0) {
    //       new_childArr[i - parseInt(i / state.columns) * diff] = state.childArr[i]
    //     }
    //   }
    //
    //   state.childArr = new_childArr;
    //   state.columns = payload;
    // },
    //
    // updateRows(state, payload) {
    //   if (payload === '') return
    //   let divnum = getDivNum(state.columns, state.rows), new_divnum = getDivNum(state.columns, payload)
    //   if (divnum > new_divnum) {
    //     for (let num = new_divnum; num < divnum; num++) {
    //       let idx = state.childArr[num]
    //       if (idx >= 0) {
    //         this.commit("removeChildren", idx );
    //         this.commit("unlogChildren", idx);
    //       }
    //     }
    //     state.childArr = state.childArr.slice(0, new_divnum)
    //   } else {
    //     state.childArr = state.childArr.concat(Array(new_divnum - divnum).fill(-1))
    //   }
    //
    //   state.rows = payload;
    // },
    // adjustArr(state, payload) {
    //   let newVal = Math.max(Number(payload.newVal), 0),
    //       oldVal = Math.max(Number(payload.oldVal), 0);
    //   console.log(payload)
    //   if (newVal < oldVal) {
    //     // you'd think that .length would be quicker here, but it doesn't trigger the getter/computed in colTemplate etc.
    //     let difference = oldVal - newVal;
    //     for (let i = 1; i <= difference; i++) {
    //       state[payload.direction].pop();
    //     }
    //   } else {
    //     let difference = newVal - oldVal;
    //     for (let i = 1; i <= difference; i++) {
    //       state[payload.direction].push({ unit: "fr", val: 1 });
    //     }
    //   }
    // },

  },
  actions: {
  },
  modules: {
  }
});

//we start off with just a few rows and columns filled with 1fr units
const createArr = (direction, arr) => {
  for (let i = 1; i <= direction; i++) {
    arr.push({ unit: "fr", val: "1" });
  }
};

const getDivNum = (c, r) => {
  return Math.max(c, 0) * Math.max(r, 0);
};
