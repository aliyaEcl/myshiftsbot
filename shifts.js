var fs = require('fs');

var shifts = ['с утра','в ночь','с ночи','выходной'];
var short_shifts = [' у','вн','сн','вх'];

var nurich = function(date) {
	return shifts[getPerson(date,true)];
}

var papa = function(date) {
	return shifts[getPerson(date,false)];
}

var week = function(date) {
	var target_date = (typeof date =='string') ? new Date(convertDate(date)) : date,
		days = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'];
	return days[target_date.getDay()];
}

/* @param person true - nurich
				 false - papa
*/
function getPerson (date, person) {
	var target_date = (typeof date =='string') ? new Date(convertDate(date)) : date, 
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

function createDoc (file_name,date1,date2,person) {

	date1 = new Date(convertDate(date1));
	date2 = new Date(convertDate(date2));

	fs.writeFileSync(file_name, '');

	var months = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь',];
	var week = 'пн|вт|ср|чт|пт|сб|вс|';
	var dash = '---------------------';
	var init_text = months[date1.getMonth()]+' '+date1.getFullYear()+'\r\n\r\n'+week+'\r\n';

	fs.appendFileSync(file_name,init_text);


	var shift;
	var date3 = date1;

	var spaces = '';

	var k = date1.getDay();

	if (k>0){
		while (k-- >1) spaces += '  |';
	} else {
		spaces = '  |  |  |  |  |  |';
	}

	var text_dates = '';
	var text_shifts = '';
	var isSunday ='';

	while (date2 >= date3) {

		shift = getPerson(date3,person);

		if (date3.getMonth() != date1.getMonth()) {
			date1 = date3;
			fs.appendFileSync(file_name, dash+'\r\n'+spaces+text_dates+'\r\n');
			fs.appendFileSync(file_name,            spaces+text_shifts+'\r\n');
			text_dates = '';
			text_shifts = '';
			fs.appendFileSync(file_name, '\r\n'+months[date1.getMonth()]+' '+date1.getFullYear()+'\r\n\r\n'+week+'\r\n');
			k = date1.getDay();
			if (k>0){
				while (k-- >1) spaces += '  |';
			} else {
				spaces = '  |  |  |  |  |  |';
			}
		}

		text_dates += (date3.getDate()<10 ? '0'+date3.getDate() : date3.getDate())+'|';
		text_shifts += short_shifts[shift]+'|';

		if (date3.getDay()==0) {
			fs.appendFileSync(file_name, dash+'\r\n'+spaces+text_dates+'\r\n');
			fs.appendFileSync(file_name,            spaces+text_shifts+'\r\n');
			text_dates = '';
			text_shifts = '';
			spaces = '';
		} 

		date3 = new Date(date3.valueOf() + 86400000);
	}

	fs.appendFileSync(file_name, dash+'\r\n'+spaces+text_dates+'\r\n');
	fs.appendFileSync(file_name,            spaces+text_shifts+'\r\n');
}

module.exports.nurich = nurich;
module.exports.papa = papa;
module.exports.createDoc = createDoc;
module.exports.convertDate = convertDate;
module.exports.week = week;