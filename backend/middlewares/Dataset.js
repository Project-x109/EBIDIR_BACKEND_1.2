const CAR_COLLATERAL = require("./CAR_COLLATERAL.json");

exports.getPersonalScore = (
  age,
  Education_Status,
  Marriage_Status,
  Number_Of_Dependents,
  Criminal_Record
) => {
  var score = 0;
  // for age
  if (age < 18) score = score + 0;
  else if (age >= 18 && age < 24) score = score + 6;
  else if (age >= 24 && age < 38) score = score + 8;
  else score = score + 10;
  // for educational status
  if (Education_Status === "Below Highschool") score = score + 5;
  if (Education_Status === "Highschool") score = score + 6;
  if (Education_Status === "Diploma") score = score + 7;
  if (Education_Status === "Degree") score = score + 8;
  if (Education_Status === "Masters") score = score + 9;
  if (Education_Status === "Phd") score = score + 10;
  // mariage status
  if (Marriage_Status === "Married") score = score + 25;
  else score = score + 20;
  // number of dependents
  if (Number_Of_Dependents == 0) score = score + 25;
  else if (Number_Of_Dependents >= 1 && Number_Of_Dependents < 3)
    score = score + 23;
  else if (Number_Of_Dependents >= 3 && Number_Of_Dependents < 5)
    score = score + 20;
  else if (Number_Of_Dependents >= 5 && Number_Of_Dependents < 10)
    score = score + 15;
  else if (Number_Of_Dependents >= 10) score = score + 10;
  // Criminal Records
  if (Criminal_Record === "No") score = score + 30;
  else if (Criminal_Record === "YES/PAST FIVE YEARS") score = score + 10;
  else if (Criminal_Record === "YES/MORE THAN FIVE YEARS") score = score + 15;
  return score;
};
exports.getEconomicScore = (
  Source_of_income,
  Experience,
  Number_Of_Loans,
  DTI,
  fully_repaid_loans
) => {
  var score = 0;
  if (Source_of_income == 0) score = score + 0;
  else if (Source_of_income == 1) score = score + 2;
  else if (Source_of_income == 2) score = score + 3;
  else if (Source_of_income == 3) score = score + 4;
  else if (Source_of_income == 4) score = score + 5;
  else if (Source_of_income == 5) score = score + 6;
  else score = score + 7.5;

  // number of loans
  if (Number_Of_Loans == 0) score = score + 15;
  else if (Number_Of_Loans == 1) score = score + 10;
  else if (Number_Of_Loans == 2) score = score + 5;
  else if (Number_Of_Loans >= 3) score = score + 3;

  // expriance
  if (Experience == 0) score = score + 3;
  else if (Experience === 1) score = score + 3;
  else if (Experience >= 2 && Experience < 10) score = score + 5;
  else if (Experience >= 10) score = score + 7.5;
  // fully repaid loans
  if (fully_repaid_loans == 0) score = score + 15;
  else if (fully_repaid_loans >= 1 && fully_repaid_loans < 5)
    score = score + 25;
  else if (fully_repaid_loans >= 5 && fully_repaid_loans < 10)
    score = score + 27;
  else if (fully_repaid_loans >= 10) score = score + 30;
  //DTI
  if (DTI >= 0 && DTI < 0.1) score = score + 90;
  else if (DTI >= 0.1 && DTI < 0.25) score = score + 85;
  else if (DTI >= 0.25 && DTI < 0.3) score = score + 80;
  else if (DTI >= 0.3 && DTI < 0.4) score = score + 75;
  else if (DTI >= 0.4 && DTI < 0.43) score = score + 70;
  else if (DTI >= 0.43 && DTI < 0.5) score = score + 65;
  else if (DTI >= 0.5 && DTI < 0.55) score = score + 60;
  else if (DTI >= 0.55 && DTI < 0.6) score = score + 55;
  else if (DTI >= 0.6 && DTI < 0.65) score = score + 50;
  else if (DTI >= 0.65 && DTI < 0.7) score = score + 45;
  else if (DTI >= 0.7 && DTI < 0.75) score = score + 40;
  else if (DTI >= 0.75 && DTI < 0.8) score = score + 35;
  else if (DTI >= 0.8 && DTI < 0.9) score = score + 30;
  else if (DTI >= 0.9) score = score + 25;
  return score;
};
exports.MILEAGE_CONSTANT = (mileage) => {
  if (mileage >= 0 && mileage < 1000) return 1;
  else if (mileage >= 1000 && mileage < 5000) return 0.98;
  else if (mileage >= 5000 && mileage < 10000) return 0.95;
  else if (mileage >= 10000 && mileage < 20000) return 0.85;
  else if (mileage >= 20000 && mileage < 40000) return 0.7;
  else if (mileage >= 40000 && mileage < 60000) return 0.6;
  else if (mileage >= 60000 && mileage < 80000) return 0.5;
  else if (mileage >= 80000 && mileage < 100000) return 0.45;
  else return 0.4;
};
exports.CAR_COLLATERAL_VALUE = (model, year, mileage) => {
  return CAR_COLLATERAL[model][year] * this.MILEAGE_CONSTANT(mileage);
};
exports.AREA = (Total_Area) => {
  if (Total_Area < 150) return "A1";
  else if (Total_Area >= 150 && Total_Area < 250) return "A2";
  else if (Total_Area >= 250 && Total_Area < 350) return "A3";
  else if (Total_Area >= 350 && Total_Area < 500) return "A4";
  else if (Total_Area >= 500) return "A5";
};

exports.LandPrice = {
  A1: {
    "G+0": {
      "Sub Structure": 0.5,
      "Super Structure": 1,
      Partially: 0.5,
      Fully: 1,
      EML: 0,
    },
    "G+1": {
      "Sub Structure": 1,
      "Super Structure": 1,
      Partially: 0.8,
      Fully: 1.5,
      EML: 0,
    },
    "G+2": {
      "Sub Structure": 1,
      "Super Structure": 2,
      Partially: 1.05,
      Fully: 2,
      EML: 0,
    },
    "G+3": {
      "Sub Structure": 1,
      "Super Structure": 3,
      Partially: 1.2,
      Fully: 2.5,
      EML: 0,
    },
    "G+4": {
      "Sub Structure": 1.2,
      "Super Structure": 4,
      Partially: 1.4,
      Fully: 3,
      EML: 0,
    },
  },
  A2: {
    "G+0": {
      "Sub Structure": 1,
      "Super Structure": 1,
      Partially: 0.7,
      Fully: 1.5,
      EML: 0,
    },
    "G+1": {
      "Sub Structure": 1,
      "Super Structure": 1.5,
      Partially: 0.8,
      Fully: 2,
      EML: 0,
    },
    "G+2": {
      "Sub Structure": 1.2,
      "Super Structure": 2.5,
      Partially: 0.9,
      Fully: 2.5,
      EML: 0,
    },
    "G+3": {
      "Sub Structure": 1.4,
      "Super Structure": 3.5,
      Partially: 1,
      Fully: 3,
      EML: 0,
    },
    "G+4": {
      "Sub Structure": 1.7,
      "Super Structure": 4.5,
      Partially: 1.2,
      Fully: 3.5,
      EML: 0,
    },
  },
  A3: {
    "G+0": {
      "Sub Structure": 1.2,
      "Super Structure": 1.2,
      Partially: 1,
      Fully: 1.8,
      EML: 0,
    },
    "G+1": {
      "Sub Structure": 1,
      "Super Structure": 1.5,
      Partially: 0.8,
      Fully: 2,
      EML: 0,
    },
    "G+2": {
      "Sub Structure": 1.7,
      "Super Structure": 3,
      Partially: 1.3,
      Fully: 3,
      EML: 0,
    },
    "G+3": {
      "Sub Structure": 1.6,
      "Super Structure": 4,
      Partially: 1.5,
      Fully: 3.25,
      EML: 0,
    },
    "G+4": {
      "Sub Structure": 1.6,
      "Super Structure": 5,
      Partially: 1.5,
      Fully: 4,
      EML: 0,
    },
    "G+5": {
      "Sub Structure": 1.8,
      "Super Structure": 6,
      Partially: 1.7,
      Fully: 4.5,
      EML: 0,
    },
    "G+6": {
      "Sub Structure": 2,
      "Super Structure": 7.25,
      Partially: 2,
      Fully: 5,
      EML: 0,
    },
  },
  A4: {
    "G+0": {
      "Sub Structure": 1.5,
      "Super Structure": 1.5,
      Partially: 1.35,
      Fully: 2,
      EML: 0,
    },
    "G+1": {
      "Sub Structure": 2,
      "Super Structure": 3,
      Partially: 1.5,
      Fully: 3.125,
      EML: 0,
    },
    "G+2": {
      "Sub Structure": 2.35,
      "Super Structure": 4.15,
      Partially: 1.7,
      Fully: 4,
      EML: 0,
    },
    "G+3": {
      "Sub Structure": 3,
      "Super Structure": 5.5,
      Partially: 2,
      Fully: 5,
      EML: 0,
    },
    "G+4": {
      "Sub Structure": 3.5,
      "Super Structure": 7,
      Partially: 2.5,
      Fully: 6,
      EML: 0,
    },
    "G+5": {
      "Sub Structure": 4.5,
      "Super Structure": 7,
      Partially: 2.5,
      Fully: 6,
      EML: 0,
    },
    "G+6": {
      "Sub Structure": 4.5,
      "Super Structure": 8.5,
      Partially: 2.7,
      Fully: 6.5,
      EML: 0,
    },
  },
  A5: {
    "G+0": {
      "Sub Structure": 2.5,
      "Super Structure": 3,
      Partially: 2,
      Fully: 3,
      EML: 0,
    },
    "G+1": {
      "Sub Structure": 3.5,
      "Super Structure": 5,
      Partially: 2.5,
      Fully: 5,
      EML: 0,
    },
    "G+2": {
      "Sub Structure": 4,
      "Super Structure": 7,
      Partially: 3,
      Fully: 8,
      EML: 0,
    },
    "G+3": {
      "Sub Structure": 4.5,
      "Super Structure": 8.5,
      Partially: 3.5,
      Fully: 9.5,
      EML: 0,
    },
    "G+4": {
      "Sub Structure": 4.6,
      "Super Structure": 12,
      Partially: 4,
      Fully: 10,
      EML: 0,
    },
    "G+5": {
      "Sub Structure": 6.5,
      "Super Structure": 15,
      Partially: 5,
      Fully: 11,
      EML: 0,
    },
    "G+6": {
      "Sub Structure": 8,
      "Super Structure": 17,
      Partially: 5.5,
      Fully: 13,
      EML: 0,
    },
    "G+7": {
      "Sub Structure": 9,
      "Super Structure": 20,
      Partially: 6,
      Fully: 15,
      EML: 0,
    },
    "G+8": {
      "Sub Structure": 11,
      "Super Structure": 23,
      Partially: 6.5,
      Fully: 18,
      EML: 0,
    },
  },
};
exports.StatusCollateral = (
  Total_Area,
  Type_of_Building,
  Construction_Status
) => {
  let price = 0;

  const Status = this.LandPrice[this.AREA(Total_Area)][Type_of_Building];
  const sub = Status["Sub Structure"] * Construction_Status.Sub_Structure;
  const sup = Status["Super Structure"] * Construction_Status.Super_Structure;
  const part = Status["Partially"] * Construction_Status.Partially;
  const full = Status["Fully"] * Construction_Status.Fully;
  const eml = Status["EML"] * Construction_Status.Electro_Mechanical_Lifts;
  price = sub + sup + part + full + eml;
  return price * 1000000;
};
exports.landValue = {
  ASKO: ["75000", "57525", "37391", "26734", "20050", "14135", "8481"],
  "ADDISU GEBEYA": [
    "123482.4",
    "100148",
    "74184",
    "57731",
    "43298",
    "30525",
    "30525",
  ],
  MEXICO: ["147826", "104495.5", "65000", "40000", "28600", "30000", "25000"],
  KEBENA: ["103448", "86000", "80697", "56470", "42352", "25622", "15373"],
  SIGNAL: ["183486", "166666", "77922", "70000", "52500", "31762", "19057"],
  "ADWA DILDIY": [
    "109085",
    "88472",
    "65535",
    "51000",
    "34000",
    "20570",
    "12342",
  ],
  TEKLEHAIMANOT: [
    "109598",
    "88888",
    "63554",
    "47665",
    "31748",
    "19207",
    "11524",
  ],
  AWARE: ["111593", "90506", "67042", "52173", "39129", "23673", "14203"],
  MEGENAGNA: ["171428", "145833", "98194", "75000", "45000", "30054", "15000"],
  "LEM HOTEL": [
    "175215",
    "142105",
    "105263.15",
    "75263",
    "56347",
    "34089",
    "20453",
  ],
  "GOFA GABRIEL": [
    "184950",
    "150000",
    "107250",
    "37198",
    "29759",
    "21333",
    "15000",
  ],
  GAZEBO: ["180851", "138712", "90162", "64465", "48348", "29250", "17549"],
  BULGARIA: ["189473", "138248", "87500", "62562", "46921", "28387", "17032"],
  GLOBAL: ["133574", "108333", "85000", "60000", "42900", "25954", "15572"],
  "22(HAYAHULET)": [
    "189903",
    "151785",
    "99307.05",
    "71004",
    "53253",
    "32218",
    "19330",
  ],
  Gerji: ["127276", "103225", "67096", "47973", "35979", "21766", "18000"],
  "Haile Garment Atikilt Tera": [
    "140000",
    "80000",
    "57200",
    "40898",
    "30673",
    "18556",
    "11133",
  ],
  "Haile Garment Diaspora": [
    "119847",
    "97200",
    "72000",
    "57777",
    "43332",
    "26215",
    "26215",
  ],
  "Bisrate Gabriel": [
    "185185",
    "137500",
    "89375",
    "79685",
    "59763",
    "36156",
    "21696",
  ],
  "Bisrate Gabriel": [
    "140913",
    "114285",
    "74285",
    "53113",
    "39834",
    "24099",
    "14459",
  ],
  "Paulos Saba Mesgid": [
    "120096",
    "97402",
    "63311",
    "45267",
    "33950",
    "20539",
    "12323",
  ],
  "Summit Feyel Bet": [
    "128622",
    "104317",
    "77272",
    "55249",
    "41436",
    "25068",
    "35095",
  ],
  "Megenagna 24": [
    "157303",
    "130391",
    "84754",
    "60599",
    "45449",
    "27496",
    "16497",
  ],
  "Bole Mesenado": [
    "210526",
    "136841",
    "97841",
    "69956",
    "52466",
    "31741",
    "19044",
  ],
  "Bole Ministeroch": [
    "218767",
    "177427",
    "131428.57",
    "93971",
    "70478",
    "42639",
    "59694",
  ],
  Piassa: ["166455", "166455", "100000", "69343", "55000", "21727", "13036"],
  AU: ["130529", "105863", "95522", "68298", "51223", "36112", "21667"],
  "Bole Bulbula": [
    "113436",
    "92000",
    "59800",
    "42757",
    "32067",
    "22607",
    "13564",
  ],
  "Kality Salo Addis Sefer": [
    "64106",
    "51992",
    "38500",
    "30000",
    "22500",
    "15862",
    "9517",
  ],
  "BOLE ARABSA": [
    "96251",
    "78063",
    "57825",
    "45000",
    "36000",
    "25380",
    "15228",
  ],
  Karra: ["106723", "86556", "70200", "52000", "39000", "27495", "16497"],
  "KALITY MASELTEGNA(BABUR TABIYA)": [
    "40388",
    "32756",
    "24264",
    "18883",
    "15107",
    "10791",
    "8333.33",
  ],
  GORO: ["107389", "87096", "64516", "46128", "34595", "24389", "14633"],
  "AYAT BESHALE": [
    "100835",
    "81781",
    "66327",
    "49131",
    "38235",
    "26955",
    "16172",
  ],
  "LEBU MEDHANIALEM": [
    "117641",
    "95411",
    "70675",
    "55000",
    "41250",
    "29081",
    "17448",
  ],
  "MESKEL FLOWER": [
    "121866",
    "98837",
    "64244",
    "45934",
    "34450",
    "24287",
    "14572",
  ],
  RICHE: ["92032", "74641", "55290", "39532", "29648", "20901", "12540"],
  Filidoro: ["47056", "38164", "28270", "22000", "16500", "11632", "6979"],
  AYAT: ["158890", "128865", "95456", "74285", "62000", "33333", "19999"],
  BOLE: ["218351", "177090", "131178", "93792", "70343", "49591", "29754"],
  "Megenagna Amce": [
    "187261",
    "151875",
    "112500",
    "80437",
    "60327",
    "42530",
    "25517",
  ],
  "Wollega Sefer": [
    "208068",
    "168750",
    "125000",
    "89375",
    "67031",
    "47256",
    "28353",
  ],
  "BOLE RWANDA": [
    "208409",
    "159849",
    "103901",
    "74289",
    "55716",
    "39279",
    "23567",
  ],
  Wossen: ["100651", "81631", "67532", "48285", "36213", "25529", "15317"],
  KOTEBE: ["93714", "76005", "56300", "43814", "32860", "19880", "11927"],
  SUMMIT: ["131296", "106485.5", "78878", "56397", "42297", "25589", "15353"],
  LIDETA: ["126461", "102564", "66666.6", "47666", "35749", "21627", "12975"],
  "RAS DESTA(PIASSA  ALKAN)": [
    "83227",
    "67500",
    "50000",
    "35750",
    "26812",
    "16221",
    "10000",
  ],
  KIRKOS: ["95711", "77625", "57500", "41112", "30833", "18653", "11191"],
  "GERMAN SQUARE": [
    "159230",
    "129141",
    "95660",
    "74444",
    "55833",
    "33778",
    "20266",
  ],
  "4 KILO": ["100000", "87500", "56875", "40665", "30498", "18451", "11070"],
  "6 KILO": ["102749", "83333", "59583", "42601", "31950", "19329", "11597"],
  BALDERAS: ["100591", "81583", "53028", "37914", "28435", "17203", "10321"],
  "CMC TSEHAY REAL ESTATE": [
    "126550",
    "102636",
    "83241",
    "61660",
    "47985",
    "38388",
    "23032",
  ],
  "LAMBERET DEHNINET": [
    "94301",
    "76481",
    "49712",
    "35543",
    "27000",
    "16335",
    "9801",
  ],
  FERENSAY: ["84259", "68337", "50620", "39393", "26666", "16132", "9678"],
  SHOLA: ["125514", "101796", "66167", "47309", "35481", "21466", "12879"],
  DEMBEL: ["123300", "100000", "76086", "54401", "40800", "24683", "14809"],
  "BOLE MICHAEL": [
    "128571",
    "98613",
    "64098",
    "45830",
    "34372",
    "20794",
    "12476",
  ],
  "BOLE HOMES": [
    "117418",
    "95230",
    "70541",
    "54896",
    "42721",
    "34177",
    "24500",
  ],
  SANFORD: ["135946", "110257", "81672", "63558", "50847", "30762", "18457"],
  "CMC SUNSHINE": [
    "146480",
    "118800",
    "88000",
    "62920",
    "47190",
    "28549",
    "17129",
  ],
  "KAZANCHIS(SETOCH ADEBABAY)": [
    "123300",
    "100000",
    "65000",
    "46475",
    "34856",
    "21086",
    "12650",
  ],
  "KERA ALMAZYE MEDA": [
    "123300",
    "100000",
    "65000",
    "46475",
    "34856",
    "21086",
    "12650",
  ],
  BELER: ["119402", "91581", "80000", "57200", "42900", "25954", "15572"],
  "BELER MENORIA": [
    "86566",
    "70200",
    "52000",
    "37180",
    "27885",
    "16870",
    "10121",
  ],
  "MEGENAGNA(CENTURY MALL)": [
    "133164",
    "108000",
    "80000",
    "57200",
    "42900",
    "25954",
    "15572",
  ],
  "GORO YERER(URAEL)": [
    "122065",
    "98999",
    "73333",
    "52433",
    "39324",
    "23790",
    "14273",
  ],
  "AYAT BABUR TABIYA": [
    "122697",
    "99511",
    "80707",
    "59783",
    "46524",
    "28147",
    "16888",
  ],
  "CMC YETEBABERUT": [
    "133683",
    "108421",
    "80312",
    "62500",
    "46875",
    "28359",
    "17015",
  ],
  "BOLE ATLAS": [
    "146012",
    "118420",
    "87719",
    "62719",
    "47039",
    "28458",
    "17074",
  ],
};
exports.LandCollateral = (Location, Distance_from_Main_Road) => {
  let price = 0;
  if (Distance_from_Main_Road < 10)
    return parseInt(this.landValue[Location][0]);
  else if (Distance_from_Main_Road >= 10 && Distance_from_Main_Road < 50)
    return parseInt(this.landValue[Location][1]);
  else if (Distance_from_Main_Road >= 50 && Distance_from_Main_Road < 100)
    return parseInt(this.landValue[Location][2]);
  else if (Distance_from_Main_Road >= 100 && Distance_from_Main_Road < 200)
    return parseInt(this.landValue[Location][3]);
  else if (Distance_from_Main_Road >= 200 && Distance_from_Main_Road < 500)
    return parseInt(this.landValue[Location][4]);
  else if (Distance_from_Main_Road >= 500 && Distance_from_Main_Road < 1000)
    return parseInt(this.landValue[Location][5]);
  else if (Distance_from_Main_Road >= 1000)
    return parseInt(this.landValue[Location][6]);
};
exports.Score = (ccr) => {
  var score = 0;
  if (ccr == 0) score = 0;
  else if (ccr > 0 && ccr <= 0.1) score = 12.5;
  else if (ccr > 0.1 && ccr <= 0.2) score = 25;
  else if (ccr > 0.2 && ccr <= 0.3) score = 37.5;
  else if (ccr > 0.3 && ccr <= 0.4) score = 50;
  else if (ccr > 0.4 && ccr <= 0.5) score = 62.5;
  else if (ccr > 0.5 && ccr <= 0.6) score = 75;
  else if (ccr > 0.6 && ccr <= 0.7) score = 87.5;
  else if (ccr > 0.7 && ccr <= 0.8) score = 100;
  else if (ccr > 0.8 && ccr <= 0.9) score = 112.5;
  else if (ccr > 0.9 && ccr <= 1) score = 125;
  else if (ccr > 1 && ccr <= 1.1) score = 137.5;
  else if (ccr > 1.1 && ccr <= 1.2) score = 150;
  else if (ccr > 1.2 && ccr <= 1.3) score = 162.5;
  else if (ccr > 1.3 && ccr <= 1.4) score = 175;
  else if (ccr > 1.4 && ccr <= 1.5) score = 187.5;
  else if (ccr > 1.5 && ccr <= 1.6) score = 200;
  else if (ccr > 1.6 && ccr <= 1.7) score = 212.5;
  else if (ccr > 1.7 && ccr <= 1.8) score = 225;
  else if (ccr > 1.8 && ccr <= 1.9) score = 237.5;
  else score = 250;
  return score;
};
exports.Employee = (emp) => {
  if (emp >= 0 && emp < 5) return 4;
  else if (emp >= 5 && emp < 15) return 7;
  else if (emp >= 15 && emp < 50) return 8;
  else if (emp >= 50) return 10;
};
exports.YearValue = (years) => {
  const d = new Date();
  let Currentyear = d.getFullYear();
  const diff = Currentyear - years;
  if (diff == 0) return 3;
  else if (diff >= 1 && diff < 2) return 5;
  else if (diff >= 2 && diff < 10) return 7;
  else if (diff >= 10) return 10;
};
exports.NOL = (loans) => {
  if (loans == 0) return 20;
  else if (loans == 1) return 15;
  else if (loans == 2) return 10;
  else if (loans == 3) return 5;
  else return 0;
};
exports.FRL = (loans) => {
  if (loans == 0) return 20;
  else if (loans >= 1 && loans < 3) return 30;
  else if (loans >= 3 && loans < 5) return 35;
  else if (loans >= 5) return 40;
};
exports.DTIValue = (dti) => {
  if (dti >= 0 && dti < 0.1) return 40;
  if (dti >= 0.1 && dti < 0.25) return 35;
  if (dti >= 0.25 && dti < 0.3) return 30;
  if (dti >= 0.3 && dti < 0.4) return 25;
  if (dti >= 0.4 && dti < 0.43) return 20;
  if (dti >= 0.43 && dti < 0.7) return 15;
  if (dti >= 0.7 && dti < 0.8) return 10;
  if (dti >= 0.8 && dti < 0.9) return 5;
  else return 0;
};
exports.FCCRValue = (dti) => {
  if (dti >= 0 && dti < 0.2) return 0;
  if (dti >= 0.2 && dti < 0.5) return 5;
  if (dti >= 0.5 && dti < 0.6) return 7.5;
  if (dti >= 0.6 && dti < 0.8) return 15;
  if (dti >= 0.8 && dti < 0.9) return 20;
  if (dti >= 0.9 && dti < 1) return 40;
  if (dti >= 1 && dti < 1.1) return 50;
  if (dti >= 1.1 && dti < 1.2) return 60;
  if (dti >= 1.2 && dti < 1.5) return 70;
  if (dti >= 1.5 && dti < 2) return 75;
  else return 80;
};
exports.GetCompanyScore = (
  Number_of_Employees,
  year,
  Number_Of_Loans,
  fully_repaid_loans,
  DTI,
  FCCR
) => {
  let score = 0;
  score = score + this.Employee(Number_of_Employees);
  score = score + this.YearValue(year);
  score = score + this.NOL(Number_Of_Loans);
  score = score + this.FRL(fully_repaid_loans);
  score = score + this.DTIValue(DTI);
  score = score + this.FCCRValue(FCCR);

  return score;
};
exports.SECTOR = [
  "Agriculture",
  "Basic Metal Production",
  "Chemical industries",
  "Commerce",
  "Construction",
  "Education",
  "Financial services",
  "Food and drink",
  "Forestry",
  "Health services",
  "Hotels",
  "Mining",
  "Mechanical and electrical engineering",
  "Media; culture; graphical",
  "Oil and gas production",
  "Postal and telecommunications services",
  "Public service",
  "Shipping",
  "Textiles",
  "Transport",
  "Transport equipment manufacturing",
  "Utilities",
];
