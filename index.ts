mexport type Languages = "spanish" | "english";
const monthNames: {
    lang: Languages;
    months: string[];
}[] = [
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
        ],
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
        ],
    },
];

export enum DateFormatEnum {
    DATE_FMT_1,
    DATE_FMT_2,
    DATE_FMT_3,
    DATETIME_MINUTES_FMT_1,
    DATETIME_MINUTES_FMT_2,
    DATETIME_MINUTES_FMT_3,
    DATETIME_SECONDS_FMT_1,
    DATETIME_SECONDS_FMT_2,
    DATETIME_SECONDS_FMT_3,
    DATETIME_SECONDS_FMT_4,
}

function dateFormatter_FMT_S_3(dateStr: string): IDateTime | null {
    let match = dateStr.match(
        /(\d{2})\/(\d{2})\/(\d{4}) - (\d{2}):(\d{2}):(\d{2}) (AM|PM)/
    );
    if (match) {
        let day = parseInt(match[1], 10);
        let month = parseInt(match[2], 10);
        let year = parseInt(match[3], 10);
        let hour = parseInt(match[4], 10);
        let minute = parseInt(match[5], 10);
        let second = parseInt(match[6], 10);
        return {
            year,
            month,
            day,
            minute,
            hour,
            second,
        };
    } else {
        return null;
    }
}

interface IDateTime {
    year: number;
    month: number; // ene: 0, ... , dic: 11
    day: number;
    hour?: number;
    minute?: number;
    second?: number;
}

function dateFormatter(dateObject: Date): IDateTime | null {
    let year = dateObject.getFullYear();
    let month = dateObject.getMonth();
    let day = dateObject.getDate();
    let hour = dateObject.getUTCHours();
    let minute = dateObject.getUTCMinutes();
    let second = dateObject.getUTCSeconds();

    function checkNullOrUndefined(value: any) {
        return value === undefined || isNaN(value) || value === null;
    }
    if ([year, month, day, hour, minute, second].some(checkNullOrUndefined)) {
        return null;
    }

    return { year, month, day, hour, minute, second };
}

function replacer(
    dateStr: string,
    valueToReplace: RegExp,
    replaceValue: string
): Date {
    return new Date(dateStr.replace(valueToReplace, replaceValue));
}
export const parseFormatedDate = (
    dateStr: string,
    format: DateFormatEnum,
    language?: Languages
): IDateTime | null => {
    const lang = language || "spanish";
    const monthObject = monthNames.find((obj) => obj.lang === lang);

    const REGEX_FMT_1 = replacer(
        dateStr,
        /(\d{2})\/(\d{2})\/(\d{4})/,
        "$3-$2-$1T00:00:00Z"
    );

    const REGEX_FMT_2 = replacer(
        dateStr,
        /(\d{2})\.(\d{2})\.(\d{4})/,
        "$3-$2-$1T00:00:00Z"
    );

    const DATE_FMT_3 = new Date(
        dateStr.replace(
            /(\d{2}) (\w{3}) (\d{4}) (\d{2}):(\d{2})/,
            function (match, day, monthStr, year, hours, minutes) {
                console.log(monthStr);
                let month = monthObject?.months.indexOf(monthStr);
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
            }
        )
    );

    const REGEX_DATETIME_MINUTES_1 = replacer(
        dateStr,
        /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/,
        "$3-$2-$1T$4:$5"
    );
    const REGEX_DATETIME_MINUTES_2 = new Date(
        dateStr.replace(
            /(\d{2})\/(\w{3})\/(\d{4}) (\d{2}):(\d{2})/,
            function (match, day, monthStr, year, hours, minutes) {
                console.log(monthStr);
                let month = monthObject?.months.indexOf(monthStr);
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
            }
        )
    );

    const REGEX_DATETIME_MINUTES_3 = replacer(
        dateStr,
        /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/,
        "$3-$2-$1T$4:$5"
    );

    const REGEX_DATETIME_SECONDS_1 = replacer(
        dateStr,
        /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
        "$3-$2-$1T$4:$5:$6"
    );

    const REGEX_DATETIME_SECONDS_2 = replacer(
        dateStr,
        /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2}) (AM|PM)/,
        "$3-$1-$2T$4:$5:$6"
    );

    const DATE_DATETIME_SECONDS_4 = new Date(dateStr);

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
