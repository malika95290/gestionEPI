"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckStatus = exports.UserTypes = void 0;
var UserTypes;
(function (UserTypes) {
    UserTypes["ADMIN"] = "admin";
    UserTypes["MANAGER"] = "manager";
    UserTypes["USER"] = "user";
})(UserTypes || (exports.UserTypes = UserTypes = {}));
var CheckStatus;
(function (CheckStatus) {
    CheckStatus["OPERATIONNEL"] = "operationnel";
    CheckStatus["REPARER"] = "reparer";
    CheckStatus["REBUT"] = "rebut";
})(CheckStatus || (exports.CheckStatus = CheckStatus = {}));
