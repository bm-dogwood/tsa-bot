export function normalizeFlight(f) {
  return {
    flightNumber: f.ident,
    status: f.status,
    origin: f.origin?.code_iata,
    destination: f.destination?.code_iata,
  };
}
