export const calcFrSize = (templateUnitArray = [{ unit: "fr", val: 1 }], size, thickness) => {
    let len = templateUnitArray.length, cms = 0, frs = 0,
        templateArray = []
    for (let i = 0; i < len; i++) {
        // var val = parseFloat(templateUnitArray[i].unit.slice(0,-2));
        // var unit = templateUnitArray[i].unit.slice(-2);
        var val = parseFloat(templateUnitArray[i].val);
        var unit = templateUnitArray[i].unit;
        unit === 'fr' ? frs += val : cms += val
        templateArray.push({'val': val, 'unit': unit})
    }

    let fsize = parseFloat(size), fthickness = parseFloat(thickness)
    var frSize = frs > 0 ? (fsize - cms - fthickness * (len + 1) ) / frs : cms/len;
    let sizeArr = {frArr: [], cmArr: [], frSize: frSize}
    for (let i = 0; i < len; i++) {
        let item = templateArray[i]
        if (item.unit === 'fr') {
            sizeArr.frArr.push(item.val)
            sizeArr.cmArr.push(item.val * frSize)
        } else {
            sizeArr.frArr.push(item.val/frSize)
            sizeArr.cmArr.push(item.val)
        }
    }
    // console.log(sizeArr)
    return sizeArr
}