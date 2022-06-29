// catch async errors
module.exports = (fn) => {
  // returns an anon function which call 'fn'
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
