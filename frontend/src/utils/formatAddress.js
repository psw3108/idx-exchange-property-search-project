export function formatAddress(property) {
  const zip =
    property.L_Zip != null &&
    property.L_Zip !== '' &&
    property.L_Zip !== 0 &&
    property.L_Zip !== '0'
      ? property.L_Zip
      : null;

  const parts = [
    property.L_Address,
    property.L_City,
    property.L_State,
    zip,
  ].filter((value) => value != null && value !== '');

  return parts.length > 0
    ? parts.join(', ')
    : 'Address unavailable';
}