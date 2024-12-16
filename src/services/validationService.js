import { Validator, addCustomMessages } from "node-input-validator";

const formatValidationError = (error) => {
  const formatted = Object.entries(error).map(([key, value]) => ({
    field: key,
    message: value.message,
  }));
  return formatted;
};

export default {
  /**
   * Input Validator middleware for controller
   * @param {object} validationObject object defining body fields and its validation types eg:{email:required|email}
   * @param {object} _extendMessages object defining message to throw on validation error eg: {"email.required":"Email is required","email.email":"Invalid email"}
   *
   */
  validateInput:
    (validationObject = {}, _extendMessages = {}) =>
    async (req, _res, next) => {
      const validation = new Validator(req.body, validationObject);
      addCustomMessages(_extendMessages);

      try {
        const isValid = await validation.check();
        if (!isValid) {
          req.validationError = formatValidationError(validation.errors);
        }
        return next();
      } catch (error) {
        req.validationError = error.message;
        return next();
      }
    },

  handleValidationErrorForViews: (req, res, viewModel, viewPath = "/", fieldsStoreKey, defaultValue = {}) => {
    const validationError = req.validationError;

    if (validationError) {
      // Remembers fields if validation error occurs
      Object.entries(defaultValue).forEach(([key, value]) => {
        viewModel[fieldsStoreKey][key] = value;
      });

      if (typeof validationError === "string") {
        viewModel.error = validationError;
      } else {
        viewModel.validationError = req.validationError;
      }
      return res.render(viewPath, viewModel);
    }
  },

  handleValidationErrorForAPI: (req, res, next) => {
    const validationError = req.validationError;

    if (validationError) {
      let error;
      if (typeof validationError === "string") {
        error = validationError;
      } else {
        error = req.validationError;
      }
      return res.json({ success: false, error });
    }
    next();
  },

  validateInputMethod: async (validationObject = {}, _extendMessages = {}, req) => {
    const validation = new Validator(req.body, validationObject);
    addCustomMessages(_extendMessages);

    try {
      const isValid = await validation.check();
      let error;

      if (!isValid) {
        error = formatValidationError(validation.errors);
        return { error: true, message: "Validation Error", validation: error };
      }
      return { error: false };
    } catch (error) {
      return { error: true, message: "Validation Error", validation: error };
    }
  },

  validateObject: async (validationObject = {}, body) => {
    const validation = new Validator(body, validationObject);

    try {
      const isValid = await validation.check();
      let error;

      if (!isValid) {
        error = formatValidationError(validation.errors);
        return { error: true, message: "Validation Error", validation: error };
      }
      return { error: false };
    } catch (error) {
      return { error: true, message: "Validation Error", validation: error };
    }
  },
};
