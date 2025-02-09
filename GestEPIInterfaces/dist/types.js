"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.EPIStatus = exports.EPIType = void 0;
// Types énumérés
var EPIType;
(function (EPIType) {
    EPIType["CORDE"] = "CORDE";
    EPIType["SANGLE"] = "SANGLE";
    EPIType["LONGE"] = "LONGE";
    EPIType["BAUDRIER"] = "BAUDRIER";
    EPIType["CASQUE"] = "CASQUE";
    EPIType["ASSURAGE"] = "ASSURAGE";
    EPIType["MOUSQUETON"] = "MOUSQUETON";
})(EPIType || (exports.EPIType = EPIType = {}));
var EPIStatus;
(function (EPIStatus) {
    EPIStatus["OPERATIONNEL"] = "OPERATIONNEL";
    EPIStatus["A_REPARER"] = "A_REPARER";
    EPIStatus["MIS_AU_REBUT"] = "MIS_AU_REBUT";
})(EPIStatus || (exports.EPIStatus = EPIStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["GESTIONNAIRE"] = "GESTIONNAIRE";
    UserRole["CORDISTE"] = "CORDISTE";
})(UserRole || (exports.UserRole = UserRole = {}));
