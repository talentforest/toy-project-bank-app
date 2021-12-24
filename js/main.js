fetch("../json/bank.json")
  .then((res) => res.json())
  .then((obj) => {
    usageHistory(obj);
    // console.log(obj);
  });

function usageHistory(obj) {
  let resultArr = [];
  let totalMap = {};

  for (let i = 0; i < obj.bankList.length; i++) {
    const bankList = obj.bankList[i];

    // console.log(totalMap[bankList.date]);
    if (totalMap[bankList.date] == undefined) {
      totalMap[bankList.date] = {
        date: "",
        total: 0,
        dtDiff: "",
        list: [],
      };
    }

    switch (totalMap[bankList.date].income) {
      case "out":
        totalMap[bankList.date].total =
          totalMap[bankList.date].total + bankList.price;
        break;
      case "in":
        totalMap[bankList.date].total =
          totalMap[bankList.date].total - bankList.price;
        break;
    }

    totalMap[bankList.date].income = bankList.income;
    totalMap[bankList.date].list.push(bankList);
  }

  resultArr = Object.keys(totalMap).reduce((obj, key) => {
    let sdt = new Date(key);
    let edt = new Date("2021-09-30");
    let dateDiff = Math.ceil(
      (edt.getTime() - sdt.getTime()) / (1000 * 3600 * 24)
    );
    totalMap[key].date = key;
    switch (dateDiff) {
      case 0:
        totalMap[key].dtDiff = "오늘";
        break;
      case 1:
        totalMap[key].dtDiff = "어제";
        break;
      default:
        totalMap[key].dtDiff = `${dateDiff}일전`;
        break;
    }
    resultArr.push(totalMap[key]);
    return resultArr;
  }, {});
  const sortable = resultArr.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    if (a.date === b.date) return 0;
  });
  // console.log('Json Parsing Successed ::: ', resultArr);
  console.log("After Sort Result ::: ", sortable);
  // console.log(sortable);

  for (let j = 0; j < sortable.length; j++) {
    const ulElem = document.createElement("ul");
    ulElem.classList.add("day-wrap");
    const liElem = document.createElement("li");
    liElem.classList.add("date-total-expense");
    const dateElem = document.createElement("div");
    dateElem.classList.add("date");
    const totalExpenseElem = document.createElement("div");
    totalExpenseElem.classList.add("total-expense");
    const historyPriceElem = document.createElement("li");
    historyPriceElem.classList.add("history-price");
    const historyElem = document.createElement("div");
    historyElem.classList.add("history");
    const priceElem = document.createElement("div");
    priceElem.classList.add("price");

    ulElem.appendChild(liElem);
    ulElem.appendChild(historyPriceElem);
    liElem.appendChild(dateElem);
    liElem.appendChild(totalExpenseElem);
    historyPriceElem.appendChild(historyElem);
    historyPriceElem.appendChild(priceElem);
    document.querySelector(".usage-history-scroll-wrap").appendChild(ulElem);

    dateElem.textContent = sortable[j].dtDiff;
    totalExpenseElem.textContent = sortable[j].total;
  }

  // accountDetail Up and Down
  const accountDetail = document.querySelector(".account-detail");
  const activeClass = "active";

  function handleClick() {
    accountDetail.classList.toggle(activeClass);
  }

  accountDetail.addEventListener("click", handleClick);

  // SWIPER
  new Swiper(".swiper", {
    direction: "horizontal",
    loop: true,
    allowTouchMove: false,

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}
