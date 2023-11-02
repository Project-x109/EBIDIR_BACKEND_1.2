exports.emailExists = (   users,companies,banks,branchs,agents, email) => {
  var unique = true;
  users.forEach((item) => {
    if (item.email == email) {
      unique = false;
    }
  });
  companies.forEach((item) => {
    if (item.cemail == email) {
      unique = false;
    }
  });
  banks.forEach((item) => {
    if (item.bank_email == email) {
      unique = false;
    }
  });
  // branchs.forEach((item) => {
  //   if (item.branch_email == email) {
  //     unique = false;
  //   }
  // });
  // agents.forEach((item) => {
  //   if (item.email == email) {
  //     unique = false;
  //   }
  // });
if(!email)
return true;
  return unique;
};
exports.phoneExists = (users, companies, banks, phone) => {
  var unique = true;
  users.forEach((item) => {
    if (item.phoneNo == phone) {
      unique = false;
    }
  });
  companies.forEach((item) => {
    if (item.cphoneNo == phone) {
      unique = false;
    }
  });
  banks.forEach((item) => {
    if (item.bank_phoneNo == phone) {
      unique = false;
    }
  });

  return unique;
};
exports.TINExists = (users, companies, tin) => {
  var unique = true;
  users.forEach((item) => {
    if (item.TIN_Number == tin) {
      unique = false;
    }
  });
  companies.forEach((item) => {
    if (item.CTIN_Number == tin) {
      unique = false;
    }
  });
  if(!tin)
  return true;
  return unique;
};
exports.PlateNumberExists = (cars, plate) => {
  var unique = true;
  cars.forEach((item) => {
    if (item.Plate_Number === plate) {
      unique = false;
    }
  });

  return unique;
};
exports.BluePrintNumberExists = (buildings, blueprint) => {
  var unique = true;
  buildings.forEach((item) => {
    if (parseInt(item.blueprintId) === parseInt(blueprint)) {
      unique = false;
    }
  });
  return unique;
};
