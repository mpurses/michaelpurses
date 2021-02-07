var $Sex = 5;
var $Age = $("#age");
var $H_ft = $("#ft");
var $H_in = $("#in");
var $lbs = $("#lbs");
var $BF = $("#bf");
var $BMR = $("#BMR");
var $activities1 = $("#activities1");
var $activities2 = $("#activities2");
var $activities3 = $("#activities3");
var $activities4 = $("#activities4");
var $activities5 = $("#activities5");
var $time1 = $("#time1");
var $time2 = $("#time2");
var $time3 = $("#time3");
var $time4 = $("#time4");
var $time5 = $("#time5");
var $Cal1 = $("#Cal1");
var $Cal2 = $("#Cal2");
var $Cal3 = $("#Cal3");
var $Cal4 = $("#Cal4");
var $Cal5 = $("#Cal5");
var $CalTotal = $("#CalTotal");
var $TDEE = $("#TDEE");
var $Goal = 1;
var $TotalCalories = $("#TotalCalories");
var $Fatg = $("#Fatg");
var $Carbsg = $("#Carbsg");
var $Proteing = $("#Proteing");
var $Fatperc = $("#Fatperc");
var $Carbsperc = $("#Carbsperc");
var $Proteinperc = $("#Proteinperc");

// SELECT2 JS
$(document).ready(function () {
	//Get the format/search function ready, not data
	$(".form-select-activities1").select2();
	$(".form-select-activities2").select2();
	$(".form-select-activities3").select2();
	$(".form-select-activities4").select2();
	$(".form-select-activities5").select2();
	// add these to select2(...):
	//{
	//	dropdownCssClass: 'form-select-activities1',
	//	selectionCssClass: 'form-select-activities1'
	//}
});

$(function () {
	function insertMETsInList1(MET) {
		var list1 = $("select#activities1");
		var newOption = $("<option></option>")
			.attr("value", MET.value)
			.text(MET.name);
		list1.append(newOption);
	}
	function insertMETsInList2(MET) {
		var list2 = $("select#activities2");
		var newOption = $("<option></option>")
			.attr("value", MET.value)
			.text(MET.name);
		list2.append(newOption);
	}
	function insertMETsInList3(MET) {
		var list3 = $("select#activities3");
		var newOption = $("<option></option>")
			.attr("value", MET.value)
			.text(MET.name);
		list3.append(newOption);
	}
	function insertMETsInList4(MET) {
		var list4 = $("select#activities4");
		var newOption = $("<option></option>")
			.attr("value", MET.value)
			.text(MET.name);
		list4.append(newOption);
	}
	function insertMETsInList5(MET) {
		var list5 = $("select#activities5");
		var newOption = $("<option></option>")
			.attr("value", MET.value)
			.text(MET.name);
		list5.append(newOption);
	}
	var CSV_URL =
		"https://raw.githubusercontent.com/mpurses/michaelpurses/main/Research/Health%26Nutrition/METs.csv";

	$.get(CSV_URL, function (data) {
		var lines = data.split("\n");
		lines.shift();

		var METS = lines.map(function (line) {
			var fields = line.split(",");
			return {
				value: fields[2],
				name: fields[1]
			};
		});
		METS.forEach(insertMETsInList1);
		METS.forEach(insertMETsInList2);
		METS.forEach(insertMETsInList3);
		METS.forEach(insertMETsInList4);
		METS.forEach(insertMETsInList5);
	});

	$('#activities1').change(function () {
		var v = $(this).val();
		$activities1.val(v);
	});
	$('#activities2').change(function () {
		var v = $(this).val();
		$activities2.val(v);
	});
	$('#activities3').change(function () {
		var v = $(this).val();
		$activities3.val(v);
	});
	$('#activities4').change(function () {
		var v = $(this).val();
		$activities4.val(v);
	});
	$('#activities5').change(function () {
		var v = $(this).val();
		$activities5.val(v);
	});

	//setTimeout(function () {
	//	$('#activities1').val(0).change();
	//}, 2000);

});

// ===================== FORMULAS  =========================
// SEX
function sexRadio(value) {
	$Sex = value;
	changeBMR();
}
// GOAL
function goalRadio(value) {
	$Goal = value;
	changeTotalCalories();
}

// BMR
function changeBMR() {
	var Sex = parseInt($Sex);
	var Age = parseInt($Age.val());
	var H_ft = parseInt($H_ft.val());
	var H_in = parseInt($H_in.val());
	var lbs = parseInt($lbs.val());
	var BF = parseInt($BF.val());

	if (isNaN(Sex)) {
		Sex = 0;
	}
	if (isNaN(Age)) {
		Age = 0;
	}
	if (isNaN(H_ft)) {
		H_ft = 0;
	}
	if (isNaN(H_in)) {
		H_in = 0;
	}
	if (isNaN(lbs)) {
		lbs = 0;
	}
	if (isNaN(BF)) {
		BF = 0;
		// BMR if Body Fat % is NOT known
		$BMR.val(
			(
				10 * (lbs / 2.205) +
				6.25 * ((H_ft * 12 + H_in) * 2.54) -
				5 * Age +
				Sex
			).toFixed(0)
		);
	} else {
		if (BF != 0) {
			// BMR if Body Fat % is known
			$BMR.val((370 + (21.6 * (1 - BF / 100) * lbs) / 2.205).toFixed(0));
		}

	}
	if ($BMR.val() < 900) {
		$BMR.val(0);
	}
	if (lbs != 0) {
		changeTDEE();
	}
}

function changeTDEE() {
	var BMR = parseFloat($BMR.val());
	var activities1 = parseFloat($activities1.val());
	var activities2 = parseFloat($activities2.val());
	var activities3 = parseFloat($activities3.val());
	var activities4 = parseFloat($activities4.val());
	var activities5 = parseFloat($activities5.val());
	var time1 = parseInt($time1.val());
	var time2 = parseInt($time2.val());
	var time3 = parseInt($time3.val());
	var time4 = parseInt($time4.val());
	var time5 = parseInt($time5.val());
	var lbs = parseInt($lbs.val());
	$Cal1.val((((activities1 * 3.5 * (lbs / 2.205)) / 200) * time1).toFixed(0));
	$Cal2.val((((activities2 * 3.5 * (lbs / 2.205)) / 200) * time2).toFixed(0));
	$Cal3.val((((activities3 * 3.5 * (lbs / 2.205)) / 200) * time3).toFixed(0));
	$Cal4.val((((activities4 * 3.5 * (lbs / 2.205)) / 200) * time4).toFixed(0));
	$Cal5.val((((activities5 * 3.5 * (lbs / 2.205)) / 200) * time5).toFixed(0));

	var Cal1 = parseInt($Cal1.val());
	var Cal2 = parseInt($Cal2.val());
	var Cal3 = parseInt($Cal3.val());
	var Cal4 = parseInt($Cal4.val());
	var Cal5 = parseInt($Cal5.val());
	$CalTotal.val((Cal1 + Cal2 + Cal3 + Cal4 + Cal5).toFixed(0));
	var CalTotal = parseInt($CalTotal.val());
	$TDEE.val((BMR * 1.15 + CalTotal).toFixed(0));
	changeTotalCalories();
}

function changeTotalCalories() {
	var TDEE = parseInt($TDEE.val());
	var Goal = parseFloat($Goal);
	var lbs = parseInt($lbs.val());
	var CalTotal = parseInt($CalTotal.val());
	var Proteing = parseInt($Proteing.val());
	var Carbsg = parseInt($Carbsg.val());
	var Fatg = parseInt($Fatg.val());

	$TotalCalories.val((TDEE * Goal).toFixed(0));
	var TotalCalories = parseInt($TotalCalories.val());


	if (isNaN(lbs)) {
		Proteing = 0;
		Carbsg = 0;
		Fatg = 0;
	} else {
		//Protein
		if (Goal == 0.8) {
			$Proteing.val(((lbs / 2.205) * 2.2).toFixed(0) + "g");
			Proteing = ((lbs / 2.205) * 2.2);
		} else {
			$Proteing.val(((lbs / 2.205) * 1.8).toFixed(0) + "g");
			Proteing = ((lbs / 2.205) * 1.8);
		}
		//Carbs
		$Carbsg.val(
			((lbs / 2.205) * 3 + CalTotal / 4 + (TotalCalories - TDEE) / 4).toFixed(0) +
			"g"
		);
		Carbsg = ((lbs / 2.205) * 3 + CalTotal / 4 + (TotalCalories - TDEE) / 4);
		//Fat
		$Fatg.val(((TotalCalories - Proteing * 4 - Carbsg * 4) / 9).toFixed(0) + "g");
		Fatg = ((TotalCalories - Proteing * 4 - Carbsg * 4) / 9);
		if (Fatg < 0) {
			$Fatg.val(0);
			Fatg = parseInt($Fatg.val());
		}
		$Fatperc.val((((Fatg * 9) / TotalCalories) * 100).toFixed(0) + "%");
		$Carbsperc.val((((Carbsg * 4) / TotalCalories) * 100).toFixed(0) + "%");
		$Proteinperc.val((((Proteing * 4) / TotalCalories) * 100).toFixed(0) + "%");
	}
}

// Update on changes
$Age.on("input", changeBMR);
$H_ft.on("input", changeBMR);
$H_in.on("input", changeBMR);
$lbs.on("input", changeBMR);
$BF.on("input", changeBMR);
$activities1.on("change", changeTDEE);
$activities2.on("change", changeTDEE);
$activities3.on("change", changeTDEE);
$activities4.on("change", changeTDEE);
$activities5.on("change", changeTDEE);
$time1.on("change", changeTDEE);
$time2.on("change", changeTDEE);
$time3.on("change", changeTDEE);
$time4.on("change", changeTDEE);
$time5.on("change", changeTDEE);
