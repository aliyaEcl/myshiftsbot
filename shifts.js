var shifts = ['с утра','в ночь','с ночи','выходной'];

var nurich = function(date) {
	return shifts[person(date,true)];
}

var papa = function(date) {
	return shifts[person(date,false)];
}

/* @param person true - nurich
				 false - papa
*/
function person (date, person) {
	var target_date = (typeof date =='string') ? new Date(convertDate(date)) : new Date(), 
		shift = getShift(target_date),
		shift2 = shift==3 ? 0 : shift+1;
	return person ? shift : shift2;
}

function convertDate(date) {
	var result = date.split('.');
	return result[1]+'.'+result[0]+'.'+result[2];
}

function getShift(date){

	var init_date = new Date('12.07.2016');
	
	var days = Math.floor(Math.abs(date - init_date) / (1000 * 60 * 60 * 24)),
		ost = days / 4;

	while (ost>=1){
		days = days - 4;
		ost = days / 4;
	}

	var shift;

	switch (ost) {
		case 0: 	shift = 0; break;
		case 0.25: 	shift = 1; break;
		case 0.5: 	shift = 2; break;
		case 0.75: 	shift = 3; break;
	}

	shift = date > init_date ? shift : 3 - shift;

	return shift;
}

module.exports.nurich = nurich;
module.exports.papa = papa;