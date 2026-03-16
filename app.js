const ids = [
  "carModel",
  "bodyCoeff",
  "engineVolume",
  "year",
  "carPrice",
  "logistics",
  "service",
  "customs2020",
  "customs2021",
  "auctionFeeMin",
  "auctionFeeMax",
];

const fields = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));

const out = {
  model: document.getElementById("outModel"),
  year: document.getElementById("outYear"),
  customs: document.getElementById("outCustoms"),
  auctionMin: document.getElementById("outAuctionMin"),
  auctionMax: document.getElementById("outAuctionMax"),
  totalMin: document.getElementById("outTotalMin"),
  totalMax: document.getElementById("outTotalMax"),
};

const parseNum = (value) => Number.parseFloat(value) || 0;

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

function calculate() {
  const carModel = fields.carModel.value.trim() || "Не указано";
  const year = fields.year.value;
  const carPrice = parseNum(fields.carPrice.value);
  const logistics = parseNum(fields.logistics.value);
  const service = parseNum(fields.service.value);

  const customs = parseNum(fields[`customs${year}`].value);

  let feeMinPct = parseNum(fields.auctionFeeMin.value);
  let feeMaxPct = parseNum(fields.auctionFeeMax.value);

  if (feeMinPct > feeMaxPct) {
    [feeMinPct, feeMaxPct] = [feeMaxPct, feeMinPct];
  }

  const auctionMin = carPrice * (feeMinPct / 100);
  const auctionMax = carPrice * (feeMaxPct / 100);

  const totalMin = carPrice + logistics + customs + service + auctionMin;
  const totalMax = carPrice + logistics + customs + service + auctionMax;

  out.model.textContent = `${carModel}, ${parseNum(fields.engineVolume.value)}L, кузов ${parseNum(
    fields.bodyCoeff.value,
  )}`;
  out.year.textContent = year;
  out.customs.textContent = money(customs);
  out.auctionMin.textContent = `${money(auctionMin)} (${feeMinPct}%)`;
  out.auctionMax.textContent = `${money(auctionMax)} (${feeMaxPct}%)`;
  out.totalMin.textContent = money(totalMin);
  out.totalMax.textContent = money(totalMax);
}

Object.values(fields).forEach((field) => {
  field.addEventListener("input", calculate);
});

calculate();
