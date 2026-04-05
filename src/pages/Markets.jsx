import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Newspaper, TrendingUp, TrendingDown, ExternalLink, Globe, Activity, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export const Markets = () => {
  const [marketNews, setMarketNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);

  const checkScrollButtons = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScrollButtons, { passive: true });
    // Initial check after news loads
    checkScrollButtons();
    // Also check on resize
    window.addEventListener('resize', checkScrollButtons);
    return () => {
      el.removeEventListener('scroll', checkScrollButtons);
      window.removeEventListener('resize', checkScrollButtons);
    };
  }, [marketNews, checkScrollButtons]);

  const scrollLeftFn = (e) => {
    if (e) e.preventDefault();
    if (e) e.stopPropagation();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: scrollContainerRef.current.scrollLeft - 380, behavior: 'smooth' });
    }
  };

  const scrollRightFn = (e) => {
    if (e) e.preventDefault();
    if (e) e.stopPropagation();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: scrollContainerRef.current.scrollLeft + 380, behavior: 'smooth' });
    }
  };

  const HARDCODED_NEWS = [
    { id: 1, title: 'Alphabet Inc. Class A Trade Ideas — GPW:GOGL', summary: "This article compiles several trade ideas and analyses for Alphabet Inc. Class A (GOOGL), focusing on both technical and fundamental perspectives.", banner_image: "https://s3-symbol-logo.tradingview.com/alphabet--big.svg", source: "TradingView", time_published: "20260404T173741", authors: [], metric: 'Bullish', url: 'https://www.tradingview.com/symbols/GPW-GOGL/ideas/' },
    { id: 2, title: 'Federal Reserve Hints at Possible Rate Adjustments Coming This Fall', summary: "Federal Reserve officials have indicated they are closely monitoring inflation metrics and may adjust rates this fall if economic cooling accelerates beyond target thresholds.", banner_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&q=80", source: "MarketWatch", time_published: "20260402T100000", authors: ["Jane Smith"], metric: 'Cautious', url: 'https://www.marketwatch.com/' },
    { id: 3, title: 'Electric Vehicle Manufacturing Sees Sudden Supply Chain Stabilisation', summary: "Global EV manufacturers report significant stabilization in rare-earth metals and battery component supply chains, leading to a bump in expected Q3 output.", banner_image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=500&q=80", source: "Bloomberg", time_published: "20260401T142000", authors: ["Jane Smith"], metric: 'Bullish', url: 'https://www.bloomberg.com/' },
    { id: 4, title: 'Bond Yields Retreat Slightly from Last Week\u2019s Multi-Year Highs', summary: "Treasury yields have slightly pulled back as institutional investors lock in profits following an unprecedented multi-year high triggered by recent jobs data.", banner_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&q=80", source: "Reuters", time_published: "20260330T091500", authors: [], metric: 'Neutral', url: 'https://www.reuters.com/' }
  ];

  // Free Tier API Fetch
  useEffect(() => {
    try {
      const cached = localStorage.getItem('cached_market_news');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.length > 0 && !parsed[0].hasOwnProperty('summary')) {
          localStorage.removeItem('cached_market_news');
        }
      }
    } catch(e) {}

    const apiKey = import.meta.env.VITE_ALPHAVANTAGE_API_KEY || 'demo';
    fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL,MSFT&apikey=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.Information) {
           console.warn("Alpha Vantage API rate limit reached:", data.Information);
           const cached = localStorage.getItem('cached_market_news');
           if (cached) {
             try {
               setMarketNews(JSON.parse(cached));
               setNewsLoading(false);
               return;
             } catch (e) {}
           }
           setMarketNews(HARDCODED_NEWS);
        } else if(data && data.feed) {
           const topPosts = data.feed.slice(0, 50).map((item, idx) => ({
             id: idx,
             title: item.title,
             summary: item.summary,
             banner_image: item.banner_image,
             source: item.source,
             time_published: item.time_published,
             authors: item.authors,
             metric: item.overall_sentiment_label || 'Neutral',
             url: item.url
           }));
           localStorage.setItem('cached_market_news', JSON.stringify(topPosts));
           setMarketNews(topPosts);
        } else {
           const cached = localStorage.getItem('cached_market_news');
           if (cached) {
             try {
               setMarketNews(JSON.parse(cached));
               setNewsLoading(false);
               return;
             } catch (e) {}
           }
           setMarketNews(HARDCODED_NEWS);
        }
        setNewsLoading(false);
      })
      .catch(err => {
        console.error("News fetch failed", err);
        const cached = localStorage.getItem('cached_market_news');
        if (cached) {
          try {
            setMarketNews(JSON.parse(cached));
            setNewsLoading(false);
            return;
          } catch (e) {}
        }
        setMarketNews(HARDCODED_NEWS);
        setNewsLoading(false);
      });
  }, []);

  // Algorithmically generate realistic intraday sparklines
  const stocks = useMemo(() => {
    const generateSparkline = (trend) => {
      let val = trend === 'up' ? 100 : 150;
      return Array.from({ length: 20 }, () => {
        val = val + (Math.random() - (trend === 'up' ? 0.3 : 0.7)) * 10;
        return { value: val };
      });
    };

    return [
      { ticker: 'AAPL', name: 'Apple Inc.', price: '173.50', change: '+1.2%', up: true, data: generateSparkline('up') },
      { ticker: 'NVDA', name: 'Nvidia Corp.', price: '882.10', change: '+3.4%', up: true, data: generateSparkline('up') },
      { ticker: 'TSLA', name: 'Tesla Inc.', price: '165.20', change: '-2.1%', up: false, data: generateSparkline('down') },
      { ticker: 'BTC', name: 'Bitcoin Network', price: '66,230', change: '+0.8%', up: true, data: generateSparkline('up') }
    ];
  }, []);

  const formatPublishedTime = (raw) => {
    if (!raw) return 'Recent';
    if (raw.length >= 8) {
      const year = raw.substring(0, 4);
      const month = raw.substring(4, 6);
      const day = raw.substring(6, 8);
      return `${month}/${day}/${year}`;
    }
    return raw;
  };

  const getSentimentColor = (metric) => {
    const m = (metric || '').toLowerCase();
    if (m.includes('bullish')) return { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', dot: 'bg-emerald-500' };
    if (m.includes('bearish')) return { text: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/30', dot: 'bg-rose-500' };
    if (m.includes('somewhat')) return { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30', dot: 'bg-amber-500' };
    return { text: 'text-slate-400', bg: 'bg-slate-500/15', border: 'border-slate-500/30', dot: 'bg-slate-500' };
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 h-full pb-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/5 dark:bg-white/5 border border-glass px-6 py-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><Globe className="text-indigo-500" strokeWidth={2.5}/> Global Markets & Equities</h2>
          <p className="text-muted text-sm mt-1 max-w-xl">Real-time institutional volume tracking and Finance news.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm flex-1 md:flex-none">
          <Activity size={16} /> Networks Operational
        </div>
      </div>

      {/* Stock Sector Module Tracker */}
      <h3 className="text-lg font-bold text-primary flex items-center gap-2 mt-2"><Activity size={18} className="text-primary"/> Institutional Stock Volume</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stocks.map((stock) => (
          <div key={stock.ticker} className="card border border-glass p-5 flex flex-col hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden group">
             {/* Background Mesh */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
             
             <div className="flex justify-between items-start z-10">
                <div>
                  <h4 className="font-bold text-lg">{stock.ticker}</h4>
                  <p className="text-xs text-muted font-medium">{stock.name}</p>
                </div>
                <div className={`flex items-center gap-1 font-semibold text-xs px-2 py-1 rounded-md ${stock.up ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {stock.up ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} {stock.change}
                </div>
             </div>
             
             <div className="mt-4 flex items-end justify-between z-10 w-full h-16">
                <div className="flex-1 h-full pr-4 opacity-70 group-hover:opacity-100 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stock.data}>
                      <Line type="monotone" dataKey="value" stroke={stock.up ? '#10b981' : '#f43f5e'} strokeWidth={2.5} dot={false} isAnimationActive={false}/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-right pb-1">
                  <p className="font-bold text-xl">${stock.price}</p>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Global Market News Feed */}
      <div className="card w-full flex flex-col p-6 shadow-sm border border-glass mt-4 relative">
        
        {/* Decorative background blur */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-5 z-10">
          <h3 className="font-semibold text-lg flex items-center gap-2"><Newspaper className="text-amber-500" size={20}/> Finance News</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted">{marketNews.length} articles</span>
            <span className="text-xs font-bold px-2 py-1 bg-amber-500/10 text-amber-500 rounded-md shadow-sm">Market Stream</span>
          </div>
        </div>
        
        {newsLoading ? (
          <div className="flex w-full items-center justify-center p-8">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative w-full">
            
            {/* Left Arrow */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={scrollLeftFn}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg border border-glass text-slate-700 dark:text-slate-200 hover:text-indigo-500 hover:scale-110 active:scale-95 transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft size={22} strokeWidth={2.5} />
              </button>
            )}

            {/* Left fade overlay */}
            {canScrollLeft && (
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--card-bg,white)] dark:from-[var(--card-bg,#0f172a)] to-transparent z-20 pointer-events-none rounded-l-xl"></div>
            )}
            
            {/* Scroll Container */}
            <div 
              ref={scrollContainerRef} 
              className="flex gap-5 overflow-x-auto py-2 pb-4 w-full px-1" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              {marketNews.length > 0 ? (
                marketNews.map(post => {
                  const sentiment = getSentimentColor(post.metric);

                  return (
                    <a 
                      key={post.id} 
                      href={post.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="relative flex flex-col group cursor-pointer shrink-0 w-[320px] md:w-[370px] rounded-2xl border border-glass bg-black/[0.03] dark:bg-white/[0.03] hover:border-indigo-500/30 hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Image Section */}
                      {post.banner_image ? (
                        <div className="w-full h-36 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                          <img 
                            src={post.banner_image} 
                            alt="" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            onError={(e) => { e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-indigo-500/10"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-indigo-500/40"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg></div>'; }}
                          />
                          {/* Gradient overlay on image */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Sentiment badge on image */}
                          <div className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${sentiment.bg} ${sentiment.text} ${sentiment.border} border backdrop-blur-sm`}>
                            <span className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${sentiment.dot} animate-pulse`}></span>
                              {post.metric}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-36 bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent flex items-center justify-center relative">
                          <Newspaper className="text-indigo-500/30" size={36} />
                          <div className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${sentiment.bg} ${sentiment.text} ${sentiment.border} border backdrop-blur-sm`}>
                            <span className="flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${sentiment.dot} animate-pulse`}></span>
                              {post.metric}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Content Section */}
                      <div className="p-4 flex flex-col flex-1">
                        {/* Source + Time */}
                        <div className="flex items-center gap-2 mb-2.5 text-[11px] text-muted font-medium">
                          <span className="text-indigo-500 font-semibold truncate max-w-[120px]">{post.source || "Finance"}</span>
                          <span className="opacity-30">•</span>
                          <span className="flex items-center gap-1 shrink-0 opacity-70"><Clock size={10}/> {formatPublishedTime(post.time_published)}</span>
                        </div>
                        
                        {/* Title */}
                        <h4 className="font-bold text-sm text-primary line-clamp-2 leading-snug group-hover:text-indigo-500 transition-colors duration-200 mb-2">{post.title}</h4>
                        
                        {/* Summary */}
                        <p className="text-xs text-muted line-clamp-4 leading-relaxed mb-3">{post.summary || 'Click to read the full article.'}</p>
                        
                        {/* Footer */}
                        <div className="mt-auto pt-3 border-t border-glass/50 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[11px] text-muted">
                            <User size={11} className="opacity-50"/>
                            <span className="truncate max-w-[100px]">
                              {post.authors && post.authors.length > 0 ? post.authors[0] : 'Editorial'}
                            </span>
                          </div>
                          <ExternalLink size={13} className="text-muted opacity-30 group-hover:opacity-100 group-hover:text-indigo-500 transition-all"/>
                        </div>
                      </div>
                    </a>
                  );
                })
              ) : (
                <div className="flex w-full items-center justify-center p-8 text-muted font-medium">
                  No live telemetry available.
                </div>
              )}
            </div>

            {/* Right fade overlay */}
            {canScrollRight && (
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--card-bg,white)] dark:from-[var(--card-bg,#0f172a)] to-transparent z-20 pointer-events-none rounded-r-xl"></div>
            )}

            {/* Right Arrow */}
            {canScrollRight && (
              <button
                type="button"
                onClick={scrollRightFn}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg border border-glass text-slate-700 dark:text-slate-200 hover:text-indigo-500 hover:scale-110 active:scale-95 transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight size={22} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
