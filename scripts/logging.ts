const isNode =  typeof window === 'undefined';

export function renderProgressBar(purpose: string, current : number, total : number, barLength : number = 50) {
  if (isNode) {
    renderProgressBarNode(purpose, current, total, barLength);
  } else {
    renderBrowserProgressBar(purpose, current, total);
  }
}
export function renderProgressBarNode(purpose: string, current : number, total : number, barLength : number = 50) {
	const percent = current / total;
	const filledLength = Math.round(barLength * percent);
	const bar = '█'.repeat(filledLength) + '-'.repeat(barLength - filledLength);
	const percentText = (percent * 100).toFixed(1).padStart(5);
  
	process.stdout.write(`\r[${bar}] ${percentText}%`);
  }

export function renderBrowserProgressBar(purpose: string, current : number, total : number) {
	let percent = (current / total)*100;
	const barAmt = Math.round(percent / 10);
	let progressBar = '█'.repeat(barAmt);
	progressBar += '░'.repeat(100 - barAmt);
	console.log(purpose, progressBar);
}