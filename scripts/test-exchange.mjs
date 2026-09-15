async function testExchangeRate() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    console.log("USD to EGP:", data.rates.EGP);
    console.log("USD to SAR:", data.rates.SAR);
    console.log("USD to EUR:", data.rates.EUR);
    console.log("USD to QAR:", data.rates.QAR);
    console.log("USD to KWD:", data.rates.KWD);
    console.log("USD to BHD:", data.rates.BHD);
  } catch (err) {
    console.error("Error:", err);
  }
}

testExchangeRate();
