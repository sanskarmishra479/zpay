import express from 'express';
import mainRoute from './routes/index.js';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/v1', mainRoute);
function main() {
    app.listen(3000);
    console.log("we are live at http://localhost:3000/");
}
main();
//# sourceMappingURL=index.js.map