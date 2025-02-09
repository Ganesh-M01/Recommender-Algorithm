"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require('dotenv/config');
require('./clients/db.js');
var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _boom = require('boom'); var _boom2 = _interopRequireDefault(_boom);
var _cors = require('cors'); var _cors2 = _interopRequireDefault(_cors);
var _ratelimiterjs = require('./rate-limiter.js'); var _ratelimiterjs2 = _interopRequireDefault(_ratelimiterjs);
var _indexjs = require('./routes/index.js'); var _indexjs2 = _interopRequireDefault(_indexjs);

const app = _express2.default.call(void 0, );

app.use(_cors2.default.call(void 0, ));
app.use(_ratelimiterjs2.default);
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: true }));

app.use(_indexjs2.default);

app.use((req, res, next) => {
  return next(_boom2.default.notFound('This route does not exist.'));
});

app.use((err, req, res, next) => {
  console.log(err);

  if (err) {
    if (err.output) {
      return res.status(err.output.statusCode || 500).json(err.output.payload);
    }

    return res.status(500).json(err);
  }
});

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`Route: ${middleware.route.path} | Methods: ${Object.keys(middleware.route.methods)}`);
  }
});

app.listen(4000, () => console.log('Server is up!'));
