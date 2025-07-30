# AI-Powered Data Analysis Dashboard

A comprehensive, interactive dashboard for analyzing Vehicle, Health, Population, and Air Quality data with AI-powered insights.


## Features

- **Multi-Dataset Analysis**: Process and visualize data from multiple CSV sources
- **Interactive Charts**: 10+ chart types including Bar, Line, Pie, Area, Scatter, HeatMap, and more
- **AI-Powered Insights**: Automated data analysis and trend detection
- **Real-time Filtering**: Dynamic data filtering and exploration
- **Responsive Design**: Modern, dark-themed UI that works on all devices
- **Data Export**: Download filtered data and insights

##  Data Sources

- **Vehicle Data** (`vahan.csv`): Vehicle registration and traffic statistics
- **Health Data** (`idsp.csv`): Disease surveillance and health metrics
- **Population Data** (`population_projection.csv`): Demographic projections
- **Air Quality Data** (`aqi.csv`): Environmental air quality measurements

## 🛠 Tech Stack

- **Framework**: Next.js 13.5.1 with TypeScript
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with dark theme
- **Charts**: Recharts for data visualization
- **Data Processing**: PapaParse for CSV handling
- **Deployment**: Vercel

##  Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gauravdev01/ai-powered-analytics-dashboard
cd ai-powered-analytics-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

##  Project Structure

```
entire_dashboard/
├── app/                    # Next.js app directory
│   ├── DashboardClient.tsx # Main dashboard component
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── charts/        # Chart components
│   │   ├── AIInsights.tsx # AI insights component
│   │   └── ...
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/data/          # CSV data files
└── types/                # TypeScript type definitions
```

##  Key Components

- **DashboardClient**: Main dashboard with tabs and layout
- **Chart Components**: 10+ different chart types for data visualization
- **AIInsights**: AI-powered data analysis and insights
- **FilterSidebar**: Dynamic data filtering interface
- **DataSummary**: Statistical summaries and metrics

##  Configuration

The dashboard automatically loads CSV files from the `public/data/` directory. Supported formats:
- Vehicle data (vahan.csv)
- Health data (idsp.csv) 
- Population data (population_projection.csv)
- Air quality data (aqi.csv)

##  Chart Types Available

1. **Bar Chart**: Categorical data comparison
2. **Line Chart**: Time series and trends
3. **Pie Chart**: Proportional data visualization
4. **Area Chart**: Cumulative data over time
5. **Scatter Plot**: Correlation analysis
6. **Heat Map**: Multi-dimensional data patterns
7. **Tree Map**: Hierarchical data structure
8. **Radar Chart**: Multi-variable comparison
9. **Bubble Chart**: Three-dimensional data
10. **Box Plot**: Statistical distribution


## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Deployed on [Vercel](https://vercel.com/) 
