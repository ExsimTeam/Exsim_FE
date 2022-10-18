import RequestManager from "src/utils/RequestManager";

/**
 * This is the api for auth.
 */
class AuthApi extends RequestManager {
  constructor() {
    super('/auth', 30 * 1000)
  }
}

export default AuthApi;