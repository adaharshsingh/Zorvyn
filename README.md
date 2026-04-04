# Zorvyn - Personal Finance Dashboard

A modern, responsive, and feature-rich personal finance dashboard built with React, Vite, Context API, and Recharts. Track transactions, manage budgets, visualize spending patterns, and achieve your financial goals with an intuitive interface.

## ✨ Features

### Dashboard
- **Summary Cards**: Overview of Total Balance, Income, and Expenses with responsive sizing and icons
- **Balance Trend Chart**: Interactive line chart showing balance progression over time (filterable by month)
- **Spending Breakdown**: Pie chart visualizing expense distribution across categories
- **Monthly Analytics**: Bar chart comparing monthly income vs expenses
- **Welcome Message**: Personalized greeting with cardholder name

### Transactions
- **Full Transaction List**: View all income and expense transactions with details
- **Advanced Filtering**: Filter by transaction type (income/expense) and category
- **Search Feature**: Real-time search across transaction descriptions
- **Sorting Options**: Sort by date (newest/oldest first)
- **Add Transactions**: Create new transactions with auto-ID generation
- **Delete Transactions**: Remove individual transactions (Admin only)
- **Pagination**: Navigate through large transaction datasets

### Financial Goals Tracker
- **RTX 5090 GPU Fund**: Track progress toward GPU goal
- **PlayStation 5 Pro**: Monitor gaming console savings
- **Curved Gaming Monitor**: Accumulate funds for monitor purchase
- Smart overflow distribution (excess GPU savings redirect to Console fund)

### Insights Engine
- **Spending Pattern Analysis**: Identifies highest expense categories
- **Cash Flow Assessment**: Calculates savings rate with personalized recommendations
- **Largest Purchase Tracking**: Highlights single biggest expense
- **Goal Progress Monitoring**: Shows accumulated savings toward goals
- **Activity Metrics**: Displays transaction volume and category diversity
- **Custom Query Synthesizer**: Filter insights by month and category

### Markets & Crypto
- **Live Crypto Data**: Real-time Bitcoin, Ethereum, and Solana prices (via CoinGecko API)
- **Stock Tracking**: View major stocks (AAPL, NVDA, TSLA, BTC) with sparkline charts
- **Market News**: Sentiment analysis and market updates (via AlphaVantage API)
- **Trending Data**: Visual indicators for market performance

### Card Management
- **Active Card Display**: Beautiful 3D credit card visualization with metallic effects
- **Card Customization**: Add/replace card details (number, expiry, cardholder name)
- **Visual Design**: Premium glassmorphic card design with texture overlays

### Support & Help
- **FAQ Section**: Expandable accordion with common questions
- **Knowledge Base Categories**: Quick access to Account & Settings, Virtual Cards, Privacy & Security, and Feature Requests
- **Search Functionality**: Find help articles and guides (responsive search input)

### Role-Based Access Control
- **Viewer Role**: Read-only access to all dashboard features
- **Admin Role**: Full access including edit/delete transactions, clear all data, manage cards
- **Role Toggle**: Easy switching between roles (Viewer/Admin)

### Theme & Customization
- **Dark Mode Toggle**: Switch between light and dark themes
- **Persistent Settings**: Theme preference saved to localStorage
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Layout.jsx          # Main layout with sidebar navigation
│   ├── CreditCard.jsx      # 3D credit card component
├── context/
│   └── FinanceContext.jsx  # Global state management (Context API)
├── hooks/
│   └── useLocalStorage.js  # Custom hook for local storage sync
├── pages/
│   ├── Dashboard.jsx       # Main dashboard with charts and analytics
│   ├── Transactions.jsx    # Transaction list and management
│   ├── Insights.jsx        # Financial insights & analysis
│   ├── Markets.jsx         # Crypto & stock data
│   ├── Cards.jsx           # Card management interface
│   └── Support.jsx         # FAQ and support section
├── utils/
│   ├── currencyFormatter.js # Currency formatting utility
│   ├── mockData.js         # 12-month transaction mock data
│   └── categories.js       # Transaction categories
├── App.jsx                 # Main app component
├── main.jsx                # React entry point
├── index.css               # Global styles with CSS variables
└── App.css                 # App-specific styles
```

## 🎨 UI/UX Highlights

- **Glassmorphism Design**: Frosted glass effect with backdrop blur
- **Responsive Typography**: Text scales smoothly across all device sizes
- **Responsive Icons**: Icons resize based on screen size (e.g., 20px mobile → 28px desktop)
- **Gradient Accents**: Vibrant indigo, emerald, and rose color schemes
- **Micro-animations**: Fade-in effects, hover states, smooth transitions
- **Dark Mode Support**: Complete dark mode styling with CSS variables
- **Accessibility**: Semantic HTML, proper color contrast, ARIA labels

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library with hooks |
| **Vite 8** | Fast build tool and dev server |
| **Context API** | State management (no Redux needed) |
| **Recharts 3** | Interactive data visualization |
| **Lucide React** | Modern icon library |
| **Tailwind CSS** | Utility-first CSS framework |
| **PostCSS** | CSS preprocessing |
| **ESLint** | Code linting |

## 📦 Setup Instructions

### Prerequisites
- Node.js v18+ recommended
- npm or yarn package manager

### Installation

1. Clone or extract the repository:
   ```bash
   cd e:/bh/zorvyn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open in browser:
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 💾 Data Persistence

All data is automatically saved to browser's `localStorage`:
- **finance_transactions** - Transaction history
- **finance_role** - User role (viewer/admin)
- **finance_theme** - Theme preference (light/dark)
- **finance_monthly_budget** - Monthly budget amount
- **finance_currency** - Selected currency (USD/EUR/GBP/INR)
- **finance_card** - Credit card details

Clear your browser's localStorage or use "Wipe Data" button to reset everything.

## 🔄 State Management

Uses React Context API for global state:
- `useFinance()` hook provides access to all app state
- Transactions, budgets, role, theme, currency
- Methods: `addTransaction()`, `deleteTransaction()`, `toggleRole()`, `toggleTheme()`, etc.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (md)
- **Tablet**: 768px - 1024px (lg)
- **Desktop**: > 1024px

Charts and components automatically adjust:
- Container sizing and spacing
- Font sizes scale smoothly
- Icons resize based on screen size
- Grid columns adapt (1 col mobile → 3 cols desktop)

## 🎯 Key Features Implementation

### Chart Responsiveness
- All Recharts components use `ResponsiveContainer` with debounce
- Chart containers have `min-h-0` for proper flex distribution
- Explicit height constraints prevent rendering issues

### Currency Support
- Supported: USD ($), EUR (€), GBP (£), INR (₹)
- Conversion rates included
- Format with appropriate number of decimals
- Localization-aware number formatting

### 12-Month Mock Data
- Generates realistic transaction data for 12 months
- Includes salary, rent, utilities, subscriptions
- Goal-tracking transactions (hardware purchases)
- Dynamic expense generation with inflation modeling

## ⚙️ Configuration

### Currency Rates (`src/utils/currencyFormatter.js`)
```javascript
const rates = {
  USD: { rate: 1, symbol: '$' },
  EUR: { rate: 0.92, symbol: '€' },
  GBP: { rate: 0.79, symbol: '£' },
  INR: { rate: 83.12, symbol: '₹' }
};
```

### CSS Variables (`src/index.css`)
All colors, shadows, and spacing defined as CSS variables for easy theming.

## 🚀 Performance Optimizations

- **Code Splitting**: React Router lazy loading
- **Memoization**: useMemo for expensive calculations
- **Local Storage Caching**: Avoid API calls for user data
- **Debounced Resize**: Prevent excessive chart re-renders
- **Lazy Loading**: Components load on demand

## 📈 Future Enhancements

- [ ] Real bank API integration
- [ ] Investment portfolio tracking
- [ ] Budget alerts and notifications
- [ ] Monthly/yearly expense reports PDF export
- [ ] Recurring transaction templates
- [ ] Multi-user support with authentication
- [ ] Tax deduction categorization
- [ ] Blockchain/crypto wallet integration

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Development

Built with ❤️ using React and modern web technologies.
