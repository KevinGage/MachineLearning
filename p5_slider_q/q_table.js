class QTable {
    // This constructor should take in an array or low/high input ranges,
    // the "window size" to break the ranges into,
    // the number of possible outputs that should go into each grid cell
    // and the min/max values for the output values
    //
    // The table is built by splitting the input high/low ranges x equal ranges where x is the window size.
    // The low int value from each range is used for each table value
    //
    // So an example would be
    // new QTable([[1,4], [4,9]], 2, 2, -100, 100)
    //
    // the resulting table would look like this where x and y are the two output q values between -100 and 100
    // "[1,4]" = [x,y]
    // "[1,7]" = [x,y]
    // "[3,4]" = [x,y]
    // "[3,7]" = [x,y]
    constructor(inputRanges, windowSize, numOutputs, minReward, maxReward) {
        this.data = {};
        const possibleStateValues = [];

        inputRanges.forEach(inputRange => {
            const low = inputRange[0];
            const high = inputRange[1];
            const incrimentSize = (high - low) / windowSize;

            const currentRangePossbleStates = [];

            let i = low;
            while(i < high) {
                currentRangePossbleStates.push(Math.floor(i).toString());
                i += incrimentSize;
            }

            possibleStateValues.push(currentRangePossbleStates);
        });

        // https://stackoverflow.com/questions/8936610/how-can-i-create-every-combination-possible-for-the-contents-of-two-arrays
        this.combineArrays(possibleStateValues).forEach(discreteState => {
            this.data[discreteState] = [];

            for(let o = 0; o < numOutputs; o++){
                this.data[discreteState].push(Math.random() * (+maxReward - +minReward) + +minReward);
            }
        });
    }

    combineArrays( array_of_arrays ){
        // First, handle some degenerate cases...
        if( ! array_of_arrays ){
            // Or maybe we should toss an exception...?
            return [];
        }

        if( ! Array.isArray( array_of_arrays ) ){
            // Or maybe we should toss an exception...?
            return [];
        }

        if( array_of_arrays.length == 0 ){
            return [];
        }

        for( let i = 0 ; i < array_of_arrays.length; i++ ){
            if( ! Array.isArray(array_of_arrays[i]) || array_of_arrays[i].length == 0 ){
                // If any of the arrays in array_of_arrays are not arrays or zero-length, return an empty array...
                return [];
            }
        }

        // Done with degenerate cases...

        // Start "odometer" with a 0 for each array in array_of_arrays.
        let odometer = new Array( array_of_arrays.length );
        odometer.fill( 0 );

        let output = [];

        let newCombination = this.formCombination( odometer, array_of_arrays );

        output.push( newCombination.trim() );

        while ( this.odometer_increment( odometer, array_of_arrays ) ){
            newCombination = this.formCombination( odometer, array_of_arrays );
            output.push( newCombination.trim() );
        }

        return output;
    }/* combineArrays() */

    // Translate "odometer" to combinations from array_of_arrays
    formCombination( odometer, array_of_arrays ){
        // In Imperative Programmingese (i.e., English):
        // let s_output = "";
        // for( let i=0; i < odometer.length; i++ ){
        //    s_output += "" + array_of_arrays[i][odometer[i]];
        // }
        // return s_output;

        // In Functional Programmingese (Henny Youngman one-liner):
        return odometer.reduce(
        function(accumulator, odometer_value, odometer_index){
            return "" + accumulator + array_of_arrays[odometer_index][odometer_value] + " ";
        },
        ""
        );
    }/* formCombination() */

    odometer_increment( odometer, array_of_arrays ){
        // Basically, work you way from the rightmost digit of the "odometer"...
        // if you're able to increment without cycling that digit back to zero,
        // you're all done, otherwise, cycle that digit to zero and go one digit to the
        // left, and begin again until you're able to increment a digit
        // without cycling it...simple, huh...?

        for( let i_odometer_digit = odometer.length-1; i_odometer_digit >=0; i_odometer_digit-- ){
            let maxee = array_of_arrays[i_odometer_digit].length - 1;   

            if( odometer[i_odometer_digit] + 1 <= maxee ){
                // increment, and you're done...
                odometer[i_odometer_digit]++;
                return true;
            }
            else{
                if( i_odometer_digit - 1 < 0 ){
                    // No more digits left to increment, end of the line...
                    return false;
                }
                else{
                    // Can't increment this digit, cycle it to zero and continue
                    // the loop to go over to the next digit...
                    odometer[i_odometer_digit]=0;
                    continue;
                }
            }
        }/* for( let odometer_digit = odometer.length-1; odometer_digit >=0; odometer_digit-- ) */
    }/* odometer_increment() */
}