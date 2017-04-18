'use strict';

let ErrorUtils = {
    _inGuard: 0,
    _globalHandler: null,
    setGlobalHandler(fun) {
      ErrorUtils._globalHandler = fun;
    },
    reportError(error) {
      ErrorUtils._globalHandler && ErrorUtils._globalHandler(error);
    },
    reportFatalError(error) {
      ErrorUtils._globalHandler && ErrorUtils._globalHandler(error, true);
    },
    applyWithGuard(fun, context, args) {
      try {
        ErrorUtils._inGuard++;
        return fun.apply(context, args);
      } catch (e) {
        ErrorUtils.reportError(e);
      } finally {
        ErrorUtils._inGuard--;
      }
    },
    applyWithGuardIfNeeded(fun, context, args) {
      if (ErrorUtils.inGuard()) {
        return fun.apply(context, args);
      }
      ErrorUtils.applyWithGuard(fun, context, args);
    },
    inGuard() {
      return ErrorUtils._inGuard;
    },
    guard(fun, name, context) {
      if (typeof fun !== 'function') {
        //console.warn('A function must be passed to ErrorUtils.guard, got ', fun);
        return null;
      }
      name = name || fun.name || '<generated guard>';
      function guarded() {
        return (
          ErrorUtils.applyWithGuard(
            fun,
            context || this,
            arguments,
            null,
            name
          )
        );
      }

      return guarded;
    },
  };

  export default ErrorUtils;
