import app from './app.js';
import connectToDB from './managers/DB.js'
import {uncaughtExceptionManager, unhandledRejectionManager} from './managers/baseErrorManager.js'

uncaughtExceptionManager

connectToDB()

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`);
});

unhandledRejectionManager