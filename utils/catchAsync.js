// catch async errors
module.export = catchAsync = (fn) => {
  // returns an anon function which call 'fn'
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
