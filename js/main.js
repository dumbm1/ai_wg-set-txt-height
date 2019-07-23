/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/
;'use strict';

(function () {

  let csInterface = new CSInterface();
  CSInterface.prototype.loadJSX = function (fileName) {
    var extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) + '/jsx/';
    csInterface.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
  };

  init();

  function init() {
    csInterface.loadJSX('hostscript.jsx');
    csInterface.loadJSX('json2.js');

    let wg_setTxtHeight = document.getElementById('wg-set-txt-height');

    wg_setTxtHeight.addEventListener('click', wg_setTxtHeight_eventHandler);

    function wg_setTxtHeight_eventHandler(e) {
      let targ = e.target;
      let statusBar = document.querySelector('.wg-set-txt-height__status-bar');

      if (targ.closest('.wg-set-txt-height__output')) {
        // statusBar.innerHTML = targ;
        if (targ.tagName.toLowerCase() === 'button') {
          csInterface.evalScript('getMinFontHeight()', _outputDivProcess);

        }
      } else if (targ.closest('.wg-set-txt-height__input')) {
        let inputDiv = document.querySelector('.wg-set-txt-height__input');
        if (targ.tagName.toLowerCase() === 'button') {
          let templateString = inputDiv.querySelector('input[type=text]').value;
          let symbolInputHeight = inputDiv.querySelector('input[type=number]').value;

          csInterface.evalScript(
            'setMinFontHeight(' + JSON.stringify([templateString, symbolInputHeight]) + ')', _outputDivProcess);
        }
      } else if (targ.closest('.wg-set-txt-height__service')) {
        statusBar.innerHTML = targ;
        if (targ.id === 'reload_button') location.reload();
      } else {
        return false;
      }

      function _outputDivProcess(result) {
        let outputDiv = document.querySelector('.wg-set-txt-height__output');
        let labelCaps = outputDiv.getElementsByTagName('label')[0];
        let labelSmall = outputDiv.getElementsByTagName('label')[1];

        try {
          let resArr = JSON.parse(result);
          let spanCaps = document.createElement('span');
          let spanSmall = document.createElement('span');
          spanCaps.innerHTML = resArr[0];
          spanSmall.innerHTML = resArr[1];

          if (labelCaps.getElementsByTagName('span')[0]) {
            labelCaps.replaceChild(spanCaps, labelCaps.getElementsByTagName('span')[0]);
          } else {
            labelCaps.append(spanCaps);
          }
          if (labelSmall.getElementsByTagName('span')[0]) {
            labelSmall.replaceChild(spanSmall, labelSmall.getElementsByTagName('span')[0]);
          } else {
            labelSmall.append(spanSmall);
          }
          statusBar.innerHTML = 'Idle';
        } catch (e) {
          statusBar.innerHTML = result;
          if (labelCaps.getElementsByTagName('span')[0]) {
            labelCaps.removeChild(labelCaps.getElementsByTagName('span')[0]);
          }
          if (labelSmall.getElementsByTagName('span')[0]) {
            labelSmall.removeChild(labelSmall.getElementsByTagName('span')[0]);
          }
        }
      }
      return false;
    }

  }

}());