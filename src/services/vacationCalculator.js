// Vacation Calculator Service
// This service provides functions to calculate vacation days based on employee tenure

/**
 * Calculate days worked from hire date to today
 * @param {string} hireDate - The employee's hire date in ISO format
 * @returns {number} - Number of days worked
 */
export function calculateDaysWorked(hireDate) {
  if (!hireDate) return 0;
  
  const today = new Date();
  const hireDateObj = new Date(hireDate);
  
  // Calculate difference in milliseconds
  const diffTime = Math.abs(today - hireDateObj);
  // Convert to days
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Calculate years worked based on days worked
 * @param {number} daysWorked - Number of days worked
 * @returns {number} - Integer number of years worked
 */
export function calculateYearsWorked(daysWorked) {
  return Math.floor(daysWorked / 365);
}

/**
 * Calculate months worked based on the remainder of days after years calculation
 * @param {number} daysWorked - Number of days worked
 * @returns {number} - Integer number of months worked
 */
export function calculateMonthsWorked(daysWorked) {
  const remainingDays = daysWorked % 365;
  return Math.floor(remainingDays / 30);
}

/**
 * Get vacation days based on years worked according to the law
 * @param {number} yearsWorked - Integer number of years worked
 * @returns {number} - Number of vacation days
 */
export function getVacationDaysByYears(yearsWorked) {
  // Vacation days table according to Mexican labor law
  // This is a simplified version and should be adjusted according to the actual law or company policy
  const vacationTable = [
    { years: 1, days: 12 },
    { years: 2, days: 14 },
    { years: 3, days: 16 },
    { years: 4, days: 18 },
    { years: 5, days: 20 },
    { years: 10, days: 22 },
    { years: 15, days: 24 },
    { years: 20, days: 26 },
    { years: 25, days: 28 },
    { years: 30, days: 30 }
  ];

  // Find the appropriate vacation days based on years worked
  for (let i = vacationTable.length - 1; i >= 0; i--) {
    if (yearsWorked >= vacationTable[i].years) {
      return vacationTable[i].days;
    }
  }
  
  return 0; // If less than 1 year worked
}

/**
 * Calculate proportional days based on months worked
 * @param {number} vacationDays - Number of vacation days for the year
 * @param {number} monthsWorked - Number of months worked
 * @returns {number} - Proportional vacation days
 */
export function calculateProportionalDays(vacationDays, monthsWorked) {
  if (vacationDays === 0) {
    return monthsWorked;
  }
  return Math.floor((vacationDays / 12) * monthsWorked);
}

/**
 * Calculate available days for the current year
 * @param {number} vacationDays - Total vacation days for the year
 * @param {number} daysTaken - Number of vacation days already taken
 * @returns {number} - Available vacation days
 */
export function calculateAvailableDays(vacationDays, daysTaken) {
  return Math.max(0, vacationDays - daysTaken);
}

/**
 * Calculate accumulated vacation days
 * @param {number} proportionalDays - Proportional vacation days
 * @param {number} availableDays - Available vacation days
 * @returns {number} - Accumulated vacation days
 */
export function calculateAccumulatedDays(proportionalDays, availableDays) {
  return proportionalDays + availableDays;
}

/**
 * Calculate all vacation metrics for an employee
 * @param {string} hireDate - The employee's hire date in ISO format
 * @param {number} daysTaken - Number of vacation days already taken
 * @returns {Object} - Object containing all vacation metrics
 */
export function calculateVacationMetrics(hireDate, daysTaken = 0) {
  const daysWorked = calculateDaysWorked(hireDate);
  const yearsWorked = calculateYearsWorked(daysWorked);
  const monthsWorked = calculateMonthsWorked(daysWorked);
  const vacationDays = getVacationDaysByYears(yearsWorked);
  const proportionalDays = calculateProportionalDays(vacationDays, monthsWorked);
  const availableDays = calculateAvailableDays(vacationDays, daysTaken);
  const accumulatedDays = calculateAccumulatedDays(proportionalDays, availableDays);
  
  return {
    daysWorked,
    yearsWorked,
    monthsWorked,
    vacationDays,
    proportionalDays,
    availableDays,
    accumulatedDays
  };
}