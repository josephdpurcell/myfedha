moment.fn.between = function(other) {
    var display = '';
    if (this.isAfter(other)) {
        // this is after other
    } else {
        // this is before other
        var day = this.date();
        var month = this.month();
        var year = this.year();
        if (other.year() != year) {
            console.log('Need to test year in "between" fn.');
            // Print the range of days and months and years
            display = this.format('MMM DD, YYYY') + ' to ' + other.format('MMM DD, YYYY');
        } else if (other.month() != month) {
            // Print the range of days and months
            display = this.format('MMM DD') + ' to ' + other.format('MMM DD, YYYY');
        } else if (other.date() != day) {
            // Print the range of days
            display = this.format('MMM DD') + ' to ' + other.format('DD, YYYY');
        } else {
            // Print the day
            display = this.format('MMM DD, YYYY');
        }
    }
    return display;
};
