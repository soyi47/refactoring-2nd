import { statement, htmlStatement } from './statement.js';
import { invoices, plays } from './data.js';

// console 문장 출력
console.log(statement(invoices, plays));

// HTML 출력
const appContainer = document.querySelector('#app');
appContainer.innerHTML = htmlStatement(invoices, plays);
