// Function to display the next Lotto draw
document
  .getElementById("lotto-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const inputDate = new Date(document.getElementById("input-date").value);
    const nextDraw = getNextLottoDraw(inputDate);
    document.getElementById(
      "result"
    ).innerText = `${nextDraw}`;

    const btcValue = await calculateBitcoinValue(nextDraw);
    if (btcValue !== null) {
        document.getElementById('btc-value').innerText = `EUR 100 of Bitcoin purchased on the draw date is worth EUR ${btcValue.toFixed(2)} today.`;
    } else {
        document.getElementById('btc-value').innerText = `Could not calculate Bitcoin value.`;
    }
  });

function getNextLottoDraw(inputDate = new Date()) {
  const drawDays = [3, 6]; // Wednesday and Saturday
  const drawTime = { hour: 20, minute: 0 }; // 8:00 PM

  // Convert input date to a Date object if it's not already
  const date = new Date(inputDate);

  // Get the current day and time
  const currentDay = date.getDay();
  const currentTime = date.getHours() * 60 + date.getMinutes(); // Total minutes since midnight

  // Function to get the draw time in minutes since midnight
  const drawTimeInMinutes = (time) => time.hour * 60 + time.minute;

  // Calculate minutes since midnight for draw time
  const drawTimeMinutes = drawTimeInMinutes(drawTime);

  // Function to add days to a date
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Find the next draw day
  for (let i = 0; i < 7; i++) {
    const nextDay = (currentDay + i) % 7;
    if (drawDays.includes(nextDay)) {
      const nextDrawDate = addDays(date, i);
      const nextDrawTime = new Date(
        nextDrawDate.setHours(drawTime.hour, drawTime.minute, 0, 0)
      );

      if (i === 0 && currentTime < drawTimeMinutes) {
        return nextDrawTime; // Today, but later in the evening
      } else if (i > 0) {
        return nextDrawTime; // Next Wednesday or Saturday
      }
    }
  }
}


// Function to fetch historical Bitcoin price
async function fetchHistoricalBitcoinPrice(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${formattedDate}`);
      const data = await response.json();
      return data.market_data.current_price.eur;
  } catch (error) {
      console.error("Error fetching historical Bitcoin price:", error);
      return null;
  }
}

// Function to fetch current Bitcoin price
async function fetchCurrentBitcoinPrice() {
  try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin`);
      const data = await response.json();
      return data.market_data.current_price.eur;
  } catch (error) {
      console.error("Error fetching current Bitcoin price:", error);
      return null;
  }
}

// Function to calculate the Bitcoin value
async function calculateBitcoinValue(drawDate) {
  const historicalPrice = await fetchHistoricalBitcoinPrice(drawDate);
  const currentPrice = await fetchCurrentBitcoinPrice();

  if (historicalPrice !== null && currentPrice !== null) {
      const amountOfBitcoinPurchased = 100 / historicalPrice;
      return amountOfBitcoinPurchased * currentPrice;
  } else {
      return null;
  }
}