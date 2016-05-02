/** A simple, naive decimal rounding function **/
export default function simpleRound( value, decimals ) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
};