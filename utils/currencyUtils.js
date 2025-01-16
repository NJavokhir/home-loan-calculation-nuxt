export const formatCurrency = (value) => {
    let rawValue = value.replace(/[^\d.-]/g, '');
  
    let [integerPart, decimalPart] = rawValue.split('.');
  
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
    if (decimalPart) {
      decimalPart = decimalPart.substring(0, 2);
    }
  
    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  };
  