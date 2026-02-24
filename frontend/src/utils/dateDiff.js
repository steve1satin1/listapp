export function dateDiff(date) {
    let now = Date.now();
    let givenDate = new Date(date).getTime()
    
    const diffTime = givenDate - now;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
    
    return diffDays;
}