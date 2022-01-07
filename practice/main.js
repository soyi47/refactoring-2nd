const invoices = require('./invoices.json'); 
const plays = require('./plays.json'); 

function statement(invoice, plays) {

  // 임시 변수를 질의 함수로 바꾸기
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  // 함수 추출하기
  function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
      case "tragedy": // 비극
        result = 40000;
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30);
        }
        break;
      case "comedy": // 희극
        result = 30000;
        if (aPerformance.audience > 20) {
          result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`);
    }
    return result;
  }

  // 함수 선언 바꾸기
  // 함수를 대입한 형태의 임시 변수를, 함수를 직접 선언해 사용하도록 바꾼다.
  function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
      {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2
      }).format(aNumber/100);
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type) 
      result += Math.floor(aPerformance.audience / 5);
    return result;
  }

  // * 반복문의 임시 변수 제거하기
  // 1. 반복문 쪼개기 - 변수 값이 누적되는 부분을 따로 빼낸다.
  // 2. 문장 슬라이드하기 - 변수 선언 문장을 반복문 바로 앞으로 옮긴다.
  // 3. 함수 추출하기 (임시 변수를 질의 함수로 바꾸기)
  // 4. 변수 인라인하기 - 추출한 함수로 변수를 대체하여 변수 제거
  function totalVolumeCredits() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += volumeCreditsFor(perf);
    }
    return result;
  }

  function totalAmount() {
    let result = 0;
    for (let perf of invoice.performances) {
      result += amountFor(perf);
    }
    return result;
  }

  let result = `청구 내역 (고객명: ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    // 청구 내역을 출력한다.
    result += `  ${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`;
  }

  result += `총액: ${usd(totalAmount())}\n`;
  result += `적립 포인트: ${totalVolumeCredits()}점\n`;
  return result;
}

console.log(statement(invoices[0], plays));