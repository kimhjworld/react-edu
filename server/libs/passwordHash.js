import crypto from 'crypto'; //패스워드암호화
const mysalt = "ebay";

export default (password) => {
    return crypto.createHash('sha512').update( password + mysalt).digest('base64');
}
