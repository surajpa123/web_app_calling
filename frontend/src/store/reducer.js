import { combineReducers } from "redux";
import callReducer from "./reducers/callReducer";

export default combineReducers({
  call: callReducer,
});
