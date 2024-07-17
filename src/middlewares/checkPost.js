import client from "../config/db.js";
import { returnErrorWithMessage } from "../utils.js";
import { getResourceId } from "../utils.js";

const checkPostExists = async (req, res, next) => {
    try {
      const id = getResourceId(req.url);
      const { rows } = await client.query('SELECT * FROM posts WHERE id = $1;', [id]);
      if (!rows.length) {
        return returnErrorWithMessage(res, 404, 'Post not found');
      }
      req.post = rows[0];
      next();
    } catch (error) {
      console.error('Error checking post: ', error);
      returnErrorWithMessage(res);
    }
  };

export default checkPostExists;