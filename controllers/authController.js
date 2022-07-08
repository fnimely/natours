const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "Success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and passowrd", 400));
  }

  // user exist or is password correct
  const user = await User.findOne({ email }).select("+password"); // include password field

  // using instance method to validate password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // if all is ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

// middleware - protect resource from users not logged in
exports.protect = catchAsync(async (req, res, next) => {
  // get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to continue.", 401)
    );
  }

  // verify token. promisify 'verify' method
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // check if user accessing routes still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(
      new AppError("The use belonging to this token no longer exist.", 401)
    );

  // check if user changed password after token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("Password changed recently! Please login again.", 401)
    );
  }

  // grant access to protected routes
  req.user = freshUser;
  next();
});

// wrapper function to pass args to middlware
exports.restrictTo = (...roles) => {
  // restrict roles allowed to interact with resource
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perfrom this action", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email address.", 404));
  }

  // generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // save changes, deactivate validators

  // send to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `
  Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.
  \nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token (valid for 10 minute).`,
      text: message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    // reset token and expired property
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new AppError(err.message, 500));
  }
});

exports.resetPassword = (req, res, next) => {};
