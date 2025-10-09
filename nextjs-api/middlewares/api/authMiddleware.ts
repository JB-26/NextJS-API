// checking if the bearer token from the client is passed
// if not, return a 401 Unauthorized response

const validate = (token: string | undefined) => {
  const validToken = true;
  if (!validToken || !token) {
    return false;
  }
  return true;
};

export function authMiddleware(req: Request) {
  // get the token from the header
  const token = req.headers.get("authorization")?.split(" ")[1];

  return { isValid: validate(token) };
}
