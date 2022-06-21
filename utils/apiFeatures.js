/** Class to implement API features (filter, sort, etc) */
class APIFeatures {
  /**
   * Sets query and query string
   * @param {Object} query - A mongoose query object (ie: Model.find())
   * @param {String} queryString - The query string on the request object
   */
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /**
   * Filters the query by manipulating the query
   */
  filter() {
    // build query
    // filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];

    // remove all fields from query object
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj);

    // advanced filtering
    let queryStr = JSON.stringify(queryObj);
    // add dollar sign in query string
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr)); // the 'query' class field now have a find method

    return this; // returns entire object
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // default sorts
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    // limiting fields / projecting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // exculde __v field used by mongo
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; // page 1 if no page in url
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
