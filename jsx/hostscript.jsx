function getMinFontHeight() {

  try {
    var result = processDoubles(selection);
    if (!result) throw new Error();
    return JSON.stringify(result);
  } catch (e) {
    return (e);
  }

  function processDoubles(selection) {

    var PT_TO_MM = 0.352777778,
        txtFrameDouble,
        txtFrameDoubleCaps,
        frameCurves,
        frameCurvesCaps,
        fontH, fontW, fontHCaps, fontWCaps,
        elem;

    elem = (function f() { // try to get the TextFrame

      if (!selection[0] && !selection.typename) throw new Error('No selection!'); // no selection

      if (selection[0]) { // object mode
        if (selection.length > 1) throw new Error('So meny selection!');
        if (selection[0].typename === 'GroupItem') { // try to get TextFrame from GrouItem
          if (selection[0].pageItems.length > 1) throw new Error('It\'s a complex group!');
          if (selection[0].pageItems[0].typename !== 'TextFrame') {
            throw new Error('Selection in group doesn\'t a Text Frame!');
          }
          return selection[0].pageItems[0];

        }
        if (selection[0].typename !== 'TextFrame') throw new Error('Selection doesn\'t a Text Frame!');
        return selection[0];
      } else if (selection.typename) { // text mode
        return selection.parent.textFrames[0];
      }

      throw new Error();
    })();

    txtFrameDouble = elem.duplicate();
    txtFrameDoubleCaps = elem.duplicate();

    txtFrameDouble.contents = 'wwwww';
    txtFrameDoubleCaps.contents = 'WWWWW';
    frameCurves = txtFrameDouble.createOutline();
    frameCurvesCaps = txtFrameDoubleCaps.createOutline();

    fontH = Math.round(frameCurves.height * PT_TO_MM * 100) / 100;
    fontHCaps = Math.round(frameCurvesCaps.height * PT_TO_MM * 100) / 100;
    fontW = Math.round(frameCurves.width * PT_TO_MM * 100) / 100;
    fontWCaps = Math.round(frameCurvesCaps.width * PT_TO_MM * 100) / 100;

    frameCurves.remove();
    frameCurvesCaps.remove();

    return [Math.min(fontHCaps, fontWCaps), Math.min(fontH, fontW)];
  }
}
/**
 * return {Array} - array of modify height of capital and small symbols
 * */
function setMinFontHeight(arr) {
  arr = arr || ['wwwww', 2];

  var symbolInputHeight = +arr[1],
      templateString    = arr [0];

  try {
    var result = processDoubles(selection);
    if (!result) throw new Error();
    return JSON.stringify(result);
  } catch (e) {
    return (e);
  }

  function processDoubles(selection) {

    var PT_TO_MM = 0.352777778,
        MM_TO_PT = 2.834645668,
        txtFrameDouble,
        txtFrameDoubleCaps,
        frameCurves,
        frameCurvesCaps,
        fontH, fontW, fontHCaps, fontWCaps,
        elem,
        scaleFactor,
        symbolResultHeight;

    elem = (function f() { // try to get the TextFrame

      if (!selection[0] && !selection.typename) throw new Error('No selection!'); // no selection

      if (selection[0]) { // object mode
        if (selection.length > 1) throw new Error('So meny selection!');
        if (selection[0].typename === 'GroupItem') { // try to get TextFrame from GrouItem
          if (selection[0].pageItems.length > 1) throw new Error('It\'s a complex group!');
          if (selection[0].pageItems[0].typename !== 'TextFrame') {
            throw new Error('Selection in group doesn\'t a Text Frame!');
          }
          return selection[0].pageItems[0];

        }
        if (selection[0].typename !== 'TextFrame') throw new Error('Selection doesn\'t a Text Frame!');
        return selection[0];
      } else if (selection.typename) { // text mode
        return selection.parent.textFrames[0];
      }

      throw new Error();
    })();

    txtFrameDouble = elem.duplicate();
    txtFrameDoubleCaps = elem.duplicate();

    txtFrameDouble.contents = templateString;
    txtFrameDoubleCaps.contents = templateString.toUpperCase();
    frameCurves = txtFrameDouble.createOutline();
    frameCurvesCaps = txtFrameDoubleCaps.createOutline();


    symbolResultHeight = symbolInputHeight * MM_TO_PT;
    scaleFactor = symbolResultHeight / Math.min(frameCurves.height, frameCurves.width);
    elem.textRange.characterAttributes.size = elem.textRange.characterAttributes.size * scaleFactor;

    for (var i = 0; i < elem.textRange.length; i++) {
      elem.textRange.characters[i].characterAttributes.baselineShift =
        elem.textRange.characters[i].characterAttributes.baselineShift * scaleFactor;
      elem.textRange.characters[i].characterAttributes.leading =
        elem.textRange.characters[i].characterAttributes.leading * scaleFactor;
    }

    fontH = Math.round(frameCurves.height * PT_TO_MM * 100 * scaleFactor) / 100;
    fontHCaps = Math.round(frameCurvesCaps.height * PT_TO_MM * 100 * scaleFactor) / 100;
    fontW = Math.round(frameCurves.width * PT_TO_MM * 100 * scaleFactor) / 100;
    fontWCaps = Math.round(frameCurvesCaps.width * PT_TO_MM * 100 * scaleFactor) / 100;

    frameCurves.remove();
    frameCurvesCaps.remove();

    return [Math.min(fontHCaps, fontWCaps), Math.min(fontH, fontW)];
  }
}
