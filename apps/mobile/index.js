// Polyfill WeakRef before any module loads (Hermes on some Android builds lacks it)
if (typeof WeakRef === 'undefined') {
  global.WeakRef = function WeakRef(target) {
    this._target = target;
  };
  global.WeakRef.prototype.deref = function () {
    return this._target;
  };
}

require('expo-router/entry');
