"use strict";
exports.__esModule = true;
exports.parseFormatedDate = exports.DateFormatEnum = void 0;
var monthNames = [
    {
        lang: "spanish",
        months: [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic",
        ]
    },
    {
        lang: "english",
        months: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ]
    },
];
var DateFormatEnum;
(function (DateFormatEnum) {
    DateFormatEnum[DateFormatEnum["DATE_FMT_1"] = 0] = "DATE_FMT_1";
    DateFormatEnum[DateFormatEnum["DATE_FMT_2"] = 1] = "DATE_FMT_2";
    DateFormatEnum[DateFormatEnum["DATE_FMT_3"] = 2] = "DATE_FMT_3";
    DateFormatEnum[DateFormatEnum["DATETIME_MINUTES_FMT_1"] = 3] = "DATETIME_MINUTES_FMT_1";
    DateFormatEnum[DateFormatEnum["DATETIME_MINUTES_FMT_2"] = 4] = "DATETIME_MINUTES_FMT_2";
    DateFormatEnum[DateFormatEnum["DATETIME_MINUTES_FMT_3"] = 5] = "DATETIME_MINUTES_FMT_3";
    DateFormatEnum[DateFormatEnum["DATETIME_SECONDS_FMT_1"] = 6] = "DATETIME_SECONDS_FMT_1";
    DateFormatEnum[DateFormatEnum["DATETIME_SECONDS_FMT_2"] = 7] = "DATETIME_SECONDS_FMT_2";
    DateFormatEnum[DateFormatEnum["DATETIME_SECONDS_FMT_3"] = 8] = "DATETIME_SECONDS_FMT_3";
    DateFormatEnum[DateFormatEnum["DATETIME_SECONDS_FMT_4"] = 9] = "DATETIME_SECONDS_FMT_4";
})(DateFormatEnum = exports.DateFormatEnum || (exports.DateFormatEnum = {}));
function dateFormatter_FMT_S_3(dateStr) {
    var match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2}):(\d{2}) (AM|PM)/);
    if (match) {
        var day = parseInt(match[1], 10);
        var month = parseInt(match[2], 10);
        var year = parseInt(match[3], 10);
        var hour = parseInt(match[4], 10);
        var minute = parseInt(match[5], 10);
        var second = parseInt(match[6], 10);
        return {
            year: year,
            month: month,
            day: day,
            minute: minute,
            hour: hour,
            second: second
        };
    }
    else {
        return null;
    }
}
function dateFormatter(dateObject) {
    var year = dateObject.getFullYear();
    var month = dateObject.getMonth();
    var day = dateObject.getDate();
    var hour = dateObject.getUTCHours();
    var minute = dateObject.getUTCMinutes();
    var second = dateObject.getUTCSeconds();
    function checkNullOrUndefined(value) {
        return value === undefined || isNaN(value) || value === null;
    }
    if ([year, month, day, hour, minute, second].some(checkNullOrUndefined)) {
        return null;
    }
    return { year: year, month: month, day: day, hour: hour, minute: minute, second: second };
}
function replacer(dateStr, valueToReplace, replaceValue) {
    return new Date(dateStr.replace(valueToReplace, replaceValue));
}
exports.parseFormatedDate = function (dateStr, format, language) {
    var lang = language || "spanish";
    var monthObject = monthNames.find(function (obj) { return obj.lang === lang; });
    var REGEX_FMT_1 = replacer(dateStr, /(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1T00:00:00Z");
    var REGEX_FMT_2 = replacer(dateStr, /(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1T00:00:00Z");
    var DATE_FMT_3 = new Date(dateStr.replace(/(\d{2}) (\w{3}) (\d{4}) (\d{2}):(\d{2})/, function (match, day, monthStr, year, hours, minutes) {
        console.log(monthStr);
        var month = monthObject === null || monthObject === void 0 ? void 0 : monthObject.months.indexOf(monthStr);
        console.log(month);
        return month !== undefined
            ? year +
                "-" +
                (month + 1).toString().padStart(2, "0") +
                "-" +
                day +
                "T" +
                hours +
                ":" +
                minutes +
                ":00Z"
            : match;
    }));
    var REGEX_DATETIME_MINUTES_1 = replacer(dateStr, /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, "$3-$2-$1T$4:$5");
    var REGEX_DATETIME_MINUTES_2 = new Date(dateStr.replace(/(\d{2})\/(\w{3})\/(\d{4}) (\d{2}):(\d{2})/, function (match, day, monthStr, year, hours, minutes) {
        console.log(monthStr);
        var month = monthObject === null || monthObject === void 0 ? void 0 : monthObject.months.indexOf(monthStr);
        console.log(month);
        return month !== undefined
            ? year +
                "-" +
                (month + 1).toString().padStart(2, "0") +
                "-" +
                day +
                "T" +
                hours +
                ":" +
                minutes +
                ":00Z"
            : match;
    }));
    var REGEX_DATETIME_MINUTES_3 = replacer(dateStr, /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/, "$3-$2-$1T$4:$5");
    var REGEX_DATETIME_SECONDS_1 = replacer(dateStr, /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6");
    var REGEX_DATETIME_SECONDS_2 = replacer(dateStr, /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2}) (AM|PM)/, "$3-$1-$2T$4:$5:$6");
    var DATE_DATETIME_SECONDS_4 = new Date(dateStr);
    switch (format) {
        case DateFormatEnum.DATE_FMT_1:
            return dateFormatter(REGEX_FMT_1);
        case DateFormatEnum.DATE_FMT_2:
            return dateFormatter(REGEX_FMT_2);
        case DateFormatEnum.DATE_FMT_3:
            return dateFormatter(DATE_FMT_3);
        case DateFormatEnum.DATETIME_MINUTES_FMT_1:
            return dateFormatter(REGEX_DATETIME_MINUTES_1);
        case DateFormatEnum.DATETIME_MINUTES_FMT_2:
            return dateFormatter(REGEX_DATETIME_MINUTES_2);
        case DateFormatEnum.DATETIME_MINUTES_FMT_3:
            return dateFormatter(REGEX_DATETIME_MINUTES_3);
        case DateFormatEnum.DATETIME_SECONDS_FMT_1:
            return dateFormatter(REGEX_DATETIME_SECONDS_1);
        case DateFormatEnum.DATETIME_SECONDS_FMT_2:
            return dateFormatter(REGEX_DATETIME_SECONDS_2);
        case DateFormatEnum.DATETIME_SECONDS_FMT_3:
            return dateFormatter_FMT_S_3(dateStr);
        case DateFormatEnum.DATETIME_SECONDS_FMT_4:
            return dateFormatter(DATE_DATETIME_SECONDS_4);
        default:
            return null;
    }
};
console.log(exports.parseFormatedDate("16/10/2023", DateFormatEnum.DATE_FMT_1));
