const generate12MonthData = () => {
  const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Subscriptions'];
  const transactions = [];
  const now = new Date();
  
  for (let m = 0; m < 12; m++) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - m, 5);
    const monthStr = targetDate.toISOString().slice(0, 7);
    
    transactions.push({
      id: `salary_${m}`,
      date: `${monthStr}-01`,
      amount: 6200 + Math.floor(Math.random() * 300),
      category: 'Salary',
      type: 'income',
      description: 'Monthly Tech Salary'
    });
    
    transactions.push({
      id: `rent_${m}`,
      date: `${monthStr}-02`,
      amount: 1800,
      category: 'Rent',
      type: 'expense',
      description: 'Apartment Lease'
    });
    
    transactions.push({
      id: `goal_rtx_${m}`,
      date: `${monthStr}-15`,
      amount: 250 + Math.floor(Math.random() * 100), 
      category: 'Savings',
      type: 'expense',
      description: 'Hardware Goal: RTX 5090 + Core i9'
    });
    
    if (m % 2 === 0) {
      transactions.push({
        id: `goal_ps5_${m}`,
        date: `${monthStr}-20`,
        amount: 50 + Math.floor(Math.random() * 50),
        category: 'Savings',
        type: 'expense',
        description: 'Hardware Goal: PlayStation 5 Pro'
      });
    } else {
      transactions.push({
        id: `goal_mon_${m}`,
        date: `${monthStr}-22`,
        amount: 30 + Math.floor(Math.random() * 40),
        category: 'Savings',
        type: 'expense',
        description: 'Hardware Goal: Curved Gaming Monitor'
      });
    }


    const baseVolume = 15;
    const inflationVolume = Math.floor((12 - m) * 2.5); 
    const expenseVolume = baseVolume + inflationVolume; 
    
    for (let i = 0; i < expenseVolume; i++) {
       const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
       const category = categories[Math.floor(Math.random() * categories.length)];
       const inflationMultiplier = ((12 - m) / 12) * 50; 
       const amount = 10 + Math.floor(Math.random() * 120) + inflationMultiplier;
       
       const descriptions = {
         'Food': ['UberEats', 'Whole Foods', 'Local Cafe', 'Sushi Dinner'],
         'Transport': ['Uber Ride', 'Gas Station', 'Subway Pass'],
         'Utilities': ['Electric Bill', 'Water Bill', 'Internet'],
         'Entertainment': ['Steam Game', 'Movie Tickets', 'Concert'],
         'Shopping': ['Amazon', 'Nike Shoes', 'Tech Accessories'],
         'Subscriptions': ['Netflix', 'Spotify', 'ChatGPT Plus']
       };
       const descList = descriptions[category];
       const desc = descList[Math.floor(Math.random() * descList.length)];

       transactions.push({
         id: `exp_${m}_${i}`,
         date: `${monthStr}-${day}`,
         amount: parseFloat(amount.toFixed(2)),
         category: category,
         type: 'expense',
         description: desc
       });
    }
  }
  
  return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const initialTransactions = generate12MonthData();

export const categories = [
  'Salary', 'Freelance', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Rent', 'Shopping', 'Savings', 'Subscriptions', 'Other'
];

export const initialBudgets = {
  'Food': 500,
  'Transport': 200,
  'Utilities': 250,
  'Entertainment': 300,
  'Rent': 1800,
  'Shopping': 400,
  'Savings': 600,
  'Subscriptions': 100,
  'Other': 100
};
