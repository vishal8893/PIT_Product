module.exports.RandomString = function (length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';

    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];

    return result;
}

module.exports.ConvertDateToDDMMYYYY = function (date) {
    date = date.toISOString().slice(0, 10)
    // console.log('date', date)
    let dt = date.split('-')
    dt[2] = dt[2].length == 1 ? '0' + dt[2] : dt[2]
    return dt[2] + '-' + dt[1] + '-' + dt[0]
}
module.exports.ConvertDateSlash = function (date) {
    return date.toLocaleDateString('en-GB')

}


module.exports.convertDate = function (date) {
    date = date.toISOString().slice(0, 10)
    let dt = date.split('-')
    dt[2] = dt[2].length == 1 ? '0' + dt[2] : dt[2]
    return dt[2] + '-' + dt[1] + '-' + dt[0]
}

module.exports.daySuffixFormat = function (d) {
    const day = d.getDate();
    // const dString = String(day);
    // const last = +dString.slice(-2);
    let suffix;
    if (day > 3 && day < 21) suffix = 'th';
    switch (day % 10) {
        case 1: suffix = "st";
        case 2: suffix = "nd";
        case 3: suffix = "rd";
        default: suffix = "th";
    }
    return day + suffix + ' ' + d.toLocaleDateString('en-GB', { month: 'short' }) + ' ' + d.getFullYear()
}

module.exports.shortMonthDateFormatter = function (d) {
    return d.getDate() + '-' + d.toLocaleDateString('en-US', { month: 'short' }) + '-' + d.getFullYear()
}

module.exports.MonthDateFormatter = function (d) {
    return d.getDate() + ' ' + d.toLocaleDateString('en-GB', { month: 'short' }) + ' ' + d.getFullYear()
}


module.exports.adjustCloserDate = function () {
    let date1 = new Date()
    let b = new Date(date1.setDate(date1.getDate() + 30))
    let closerDatestr = b.toString()
    if (closerDatestr.indexOf('Sat') != -1) {
        b.setDate(b.getDate() + 2)
    } else if (closerDatestr.indexOf('Sun') != -1) {
        b.setDate(b.getDate() + 1)
    }
    return b;
}
module.exports.lastday = function (d) {

    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() + ' ' + d.toLocaleDateString('en-GB', { month: 'short' }) + ' ' + d.getFullYear()
}
module.exports.last_day = function (d) {

    return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate() + '-' + d.toLocaleDateString('en-GB', { month: 'short' }) + '-' + d.getFullYear().toString().substr(-2)
}


module.exports.number2text = function (value) {
    var fraction = Math.round(frac(value) * 100);
    var f_text = "";

    if (fraction > 0) {
        f_text = "AND " + convert_number(fraction) + " PAISE";
    }

    return " RUPEES " + convert_number(value) + ' ' + f_text + " ONLY";
}

function frac(f) {
    return f % 1;
}

function convert_number(number) {
    if ((number < 0) || (number > 999999999)) {
        return "NUMBER OUT OF RANGE!";
    }
    var Gn = Math.floor(number / 10000000);  /* Crore */
    number -= Gn * 10000000;
    var kn = Math.floor(number / 100000);     /* lakhs */
    number -= kn * 100000;
    var Hn = Math.floor(number / 1000);      /* thousand */
    number -= Hn * 1000;
    var Dn = Math.floor(number / 100);       /* Tens (deca) */
    number = number % 100;               /* Ones */
    var tn = Math.floor(number / 10);
    var one = Math.floor(number % 10);
    var res = "";

    if (Gn > 0) {
        res += (convert_number(Gn) + " CRORE");
    }
    if (kn > 0) {
        res += (((res == "") ? "" : " ") +
            convert_number(kn) + " LAKH");
    }
    if (Hn > 0) {
        res += (((res == "") ? "" : " ") +
            convert_number(Hn) + " THOUSAND");
    }

    if (Dn) {
        res += (((res == "") ? "" : " ") +
            convert_number(Dn) + " HUNDRED");
    }


    var ones = Array("", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN");
    var tens = Array("", "", "TWENTY", "THIRTY", "FOURTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY");

    if (tn > 0 || one > 0) {
        if (!(res == "")) {
            res += " AND ";
        }
        if (tn < 2) {
            res += ones[tn * 10 + one];
        }
        else {

            res += tens[tn];
            if (one > 0) {
                res += ("-" + ones[one]);
            }
        }
    }

    if (res == "") {
        res = "zero";
    }
    return res;
}
