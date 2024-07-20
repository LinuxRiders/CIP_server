import { getTokenHeader, verifyAccessToken } from "./Tokens.js";

export function authenticate(req, res, next) {
    const token = getTokenHeader(req.headers);


    if (!token) {
        return res.status(401).json(
            {
                statusCode: 401,
                error: 'No Token Provided'

            });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
        return res.status(401).json(
            {
                statusCode: 401,
                error: 'No Token valid'

            });
    }

    req.user = { ...decoded.infoUser };
    next();
}